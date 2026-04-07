/**
 * lib/scraper.js
 *
 * Playwright-based scraper for:
 *   A. REIV auction clearance rates by suburb
 *   B. Domain suburb profiles (median, DOM, rental yield)
 *   C. Google Sheet write (suburb_data tab)
 *
 * Usage (standalone):
 *   node scripts/test-scraper.js
 *
 * Usage (from API route):
 *   import { runScraper } from '@/lib/scraper'
 *   const results = await runScraper()
 */

import { chromium } from 'playwright'

// ─── Suburb definitions ───────────────────────────────────────────────────────

const SUBURBS = [
  { name: 'Fitzroy',       domainSlug: 'fitzroy-vic-3065',      reivName: 'Fitzroy' },
  { name: 'Collingwood',   domainSlug: 'collingwood-vic-3066',  reivName: 'Collingwood' },
  { name: 'Richmond',      domainSlug: 'richmond-vic-3121',     reivName: 'Richmond' },
  { name: 'Northcote',     domainSlug: 'northcote-vic-3070',    reivName: 'Northcote' },
  { name: 'Brunswick',     domainSlug: 'brunswick-vic-3056',    reivName: 'Brunswick' },
  { name: 'Abbotsford',    domainSlug: 'abbotsford-vic-3067',   reivName: 'Abbotsford' },
  { name: 'Fitzroy North', domainSlug: 'fitzroy-north-vic-3068',reivName: 'Fitzroy North' },
  { name: 'Carlton',       domainSlug: 'carlton-vic-3053',      reivName: 'Carlton' },
  { name: 'Prahran',       domainSlug: 'prahran-vic-3181',      reivName: 'Prahran' },
  { name: 'South Yarra',   domainSlug: 'south-yarra-vic-3141',  reivName: 'South Yarra' },
]

// ─── A. REIV clearance rates ──────────────────────────────────────────────────

/**
 * Scrape REIV auction results page for clearance rates.
 * Returns: { 'Fitzroy': 74, 'Collingwood': 79, ... }
 */
async function scrapeReivClearanceRates(browser) {
  console.log('[scraper] Scraping REIV clearance rates...')
  const results = {}
  const page = await browser.newPage()

  try {
    await page.goto('https://www.reiv.com.au/market-data/auction-results', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    // Wait for the page to load data — REIV uses dynamic tables
    await page.waitForTimeout(3000)

    // Try to find suburb clearance rate table rows
    // REIV renders a table with suburb name and clearance rate columns
    const rows = await page.$$eval(
      'table tr, [class*="suburb"] [class*="row"], [class*="auction"] tr',
      (trs) => trs.map(tr => {
        const cells = [...tr.querySelectorAll('td, [class*="cell"]')]
        return cells.map(c => c.innerText?.trim())
      })
    )

    for (const cells of rows) {
      if (!cells || cells.length < 2) continue
      const nameCell = cells[0]
      // Look for a percentage value in any cell
      for (const cell of cells.slice(1)) {
        const pctMatch = cell?.match(/(\d{1,3}(?:\.\d)?)\s*%/)
        if (pctMatch) {
          const rate = parseFloat(pctMatch[1])
          // Match against our suburb list
          for (const suburb of SUBURBS) {
            if (nameCell?.toLowerCase().includes(suburb.reivName.toLowerCase())) {
              results[suburb.name] = rate
              break
            }
          }
          break
        }
      }
    }

    // Fallback: try extracting from page text via JSON-LD or embedded data
    if (Object.keys(results).length === 0) {
      const pageText = await page.content()
      for (const suburb of SUBURBS) {
        // Pattern: suburb name near a percentage
        const pattern = new RegExp(
          suburb.reivName.replace(/\s+/g, '\\s+') + '[^%]{0,100}?(\\d{1,3}(?:\\.\\d)?)\\s*%',
          'i'
        )
        const m = pageText.match(pattern)
        if (m) results[suburb.name] = parseFloat(m[1])
      }
    }

    console.log(`[scraper] REIV: found clearance rates for ${Object.keys(results).length}/${SUBURBS.length} suburbs`)
    console.log('[scraper] REIV results:', results)
  } catch (err) {
    console.warn('[scraper] REIV scrape error:', err.message)
  } finally {
    await page.close()
  }

  return results
}

// ─── B. Domain suburb profiles ────────────────────────────────────────────────

/**
 * Scrape a single Domain suburb profile page.
 * Returns: { median, dom, rental_yield }
 */
async function scrapeDomainSuburb(browser, suburb) {
  const url = `https://www.domain.com.au/suburb-profile/${suburb.domainSlug}/`
  const page = await browser.newPage()

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-AU,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  })

  const result = { median: null, dom: null, rental_yield: null, clearance: null }

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(3000)

    const html = await page.content()

    // ── Parse stats table ─────────────────────────────────────────────────────
    // Domain renders a table: beds | type | median | days | clearance% | count
    // We target the 2-bed House row as the headline figure; fall back to any house row.
    const tableRows = await page.$$eval('tbody tr', rows =>
      rows.map(tr => {
        const cells = [...tr.querySelectorAll('td')].map(td => td.innerText?.trim())
        return cells
      })
    ).catch(() => [])

    // Find best house row: prefer 2-bed, then 3-bed, then any
    const houseRows = tableRows.filter(cells =>
      cells.length >= 4 && cells[1]?.toLowerCase() === 'house'
    )
    const preferredRow = houseRows.find(r => r[0] === '2')
      || houseRows.find(r => r[0] === '3')
      || houseRows[0]

    if (preferredRow) {
      // cells: [beds, type, median, days, clearance%, count]
      result.median    = parsePriceString(preferredRow[2])
      const domMatch   = preferredRow[3]?.match(/(\d+)/)
      result.dom       = domMatch ? parseInt(domMatch[1]) : null
      const clrMatch   = preferredRow[4]?.match(/([\d.]+)/)
      result.clearance = clrMatch ? parseFloat(clrMatch[1]) : null
    }

    // ── DOM fallback: JSON in source ──────────────────────────────────────────
    if (!result.dom) {
      const m = html.match(/"daysOnMarket"\s*:\s*(\d+)/)
      if (m) result.dom = parseInt(m[1])
    }

    // ── Rental yield — not in the table, try JSON ─────────────────────────────
    const yieldMatch = html.match(/"rentalYield"\s*:\s*([\d.]+)/)
      || html.match(/"grossRentalYield"\s*:\s*([\d.]+)/)
    if (yieldMatch) result.rental_yield = parseFloat(yieldMatch[1])

    console.log(`[scraper] Domain ${suburb.name}: median=${result.median} dom=${result.dom} clearance=${result.clearance}% yield=${result.rental_yield}`)
  } catch (err) {
    console.warn(`[scraper] Domain ${suburb.name} failed: ${err.message}`)
  } finally {
    await page.close()
  }

  return result
}

function parsePriceString(str) {
  // Converts "$1.48M" → 1480000, "$680K" → 680000, "$1,480,000" → 1480000
  const clean = str.replace(/[$,\s]/g, '')
  if (/m$/i.test(clean)) return Math.round(parseFloat(clean) * 1_000_000)
  if (/k$/i.test(clean)) return Math.round(parseFloat(clean) * 1_000)
  return parseInt(clean) || null
}

/**
 * Scrape all 10 Domain suburb profiles sequentially (polite, avoids blocks).
 * Returns: { 'Fitzroy': { median, dom, rental_yield }, ... }
 */
async function scrapeAllDomainSuburbs(browser) {
  console.log('[scraper] Scraping Domain suburb profiles...')
  const results = {}

  for (const suburb of SUBURBS) {
    results[suburb.name] = await scrapeDomainSuburb(browser, suburb)
    // Polite delay between requests
    await new Promise(r => setTimeout(r, 1500))
  }

  return results
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Run the full scrape pipeline. Returns structured data — no sheet writing.
 * Sheet writes are handled downstream by n8n's Google Sheets node.
 *
 * @param {object} opts
 * @param {boolean} opts.headless - run browser headlessly (default true)
 * @returns {Promise<{ results, errors }>}
 */
export async function runScraper({ headless = true } = {}) {
  const errors = []

  console.log('[scraper] Launching browser...')
  const browser = await chromium.launch({ headless })

  let reivData = {}
  let domainData = {}

  try {
    ;[reivData, domainData] = await Promise.all([
      scrapeReivClearanceRates(browser).catch(err => {
        errors.push(`REIV: ${err.message}`)
        return {}
      }),
      scrapeAllDomainSuburbs(browser).catch(err => {
        errors.push(`Domain: ${err.message}`)
        return {}
      }),
    ])
  } finally {
    await browser.close()
    console.log('[scraper] Browser closed')
  }

  // Clearance: prefer REIV (authoritative), fall back to Domain table
  const results = SUBURBS.map(suburb => ({
    suburb:           suburb.name,
    median_price:     domainData[suburb.name]?.median       ?? null,
    dom:              domainData[suburb.name]?.dom           ?? null,
    rental_yield:     domainData[suburb.name]?.rental_yield ?? null,
    clearance_rate:   reivData[suburb.name] ?? domainData[suburb.name]?.clearance ?? null,
    quarterly_change: null,
  }))

  return { results, errors }
}
