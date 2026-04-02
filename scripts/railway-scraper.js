#!/usr/bin/env node
/**
 * scripts/railway-scraper.js
 *
 * Standalone Playwright scraper — runs outside Next.js.
 * Outputs a JSON array of suburb data to stdout.
 *
 * Usage:
 *   node scripts/railway-scraper.js
 *   node scripts/railway-scraper.js --suburbs=Fitzroy,Collingwood
 *
 * Output (stdout):
 *   { "ok": true, "timestamp": "...", "suburbs": [...] }
 *
 * On error (stdout):
 *   { "ok": false, "error": "..." }
 *
 * Requirements:
 *   npm install playwright
 *   npx playwright install chromium
 */

import { chromium } from 'playwright'

const ALL_SUBURBS = [
  { name: 'Fitzroy',       slug: 'fitzroy-vic-3065' },
  { name: 'Collingwood',   slug: 'collingwood-vic-3066' },
  { name: 'Richmond',      slug: 'richmond-vic-3121' },
  { name: 'Northcote',     slug: 'northcote-vic-3070' },
  { name: 'Brunswick',     slug: 'brunswick-vic-3056' },
  { name: 'Abbotsford',    slug: 'abbotsford-vic-3067' },
  { name: 'Fitzroy North', slug: 'fitzroy-north-vic-3068' },
  { name: 'Carlton',       slug: 'carlton-vic-3053' },
  { name: 'Prahran',       slug: 'prahran-vic-3181' },
  { name: 'South Yarra',   slug: 'south-yarra-vic-3141' },
]

// Parse --suburbs=Fitzroy,Collingwood arg
const suburbArg = process.argv.find(a => a.startsWith('--suburbs='))
const suburbFilter = suburbArg
  ? suburbArg.replace('--suburbs=', '').split(',').map(s => s.trim().toLowerCase())
  : null

const SUBURBS = suburbFilter
  ? ALL_SUBURBS.filter(s => suburbFilter.includes(s.name.toLowerCase()))
  : ALL_SUBURBS

function parsePriceString(str) {
  if (!str) return null
  const clean = str.replace(/[$,\s]/g, '')
  if (/m$/i.test(clean)) return Math.round(parseFloat(clean) * 1_000_000)
  if (/k$/i.test(clean)) return Math.round(parseFloat(clean) * 1_000)
  return parseInt(clean) || null
}

async function scrapeSuburb(page, suburb) {
  const url = `https://www.domain.com.au/suburb-profile/${suburb.slug}/`

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(3000)

    // Domain renders a stats table: beds | type | median | days | clearance% | count
    const tableRows = await page.$$eval('tbody tr', rows =>
      rows.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText?.trim()))
    ).catch(() => [])

    const houseRows = tableRows.filter(cells =>
      cells.length >= 4 && cells[1]?.toLowerCase() === 'house'
    )
    const row = houseRows.find(r => r[0] === '2')
      || houseRows.find(r => r[0] === '3')
      || houseRows[0]

    let median = null, dom = null, clearance = null

    if (row) {
      median    = parsePriceString(row[2])
      const dm  = row[3]?.match(/(\d+)/)
      dom       = dm ? parseInt(dm[1]) : null
      const cm  = row[4]?.match(/([\d.]+)/)
      clearance = cm ? parseFloat(cm[1]) : null
    }

    // DOM fallback: JSON embedded in page source
    if (!dom) {
      const html = await page.content()
      const m = html.match(/"daysOnMarket"\s*:\s*(\d+)/)
      if (m) dom = parseInt(m[1])
    }

    return { name: suburb.name, median, dom, clearance, rental_yield: null, error: null }
  } catch (err) {
    return { name: suburb.name, median: null, dom: null, clearance: null, rental_yield: null, error: err.message }
  }
}

async function main() {
  let browser
  try {
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      extraHTTPHeaders: { 'Accept-Language': 'en-AU,en;q=0.9' },
    })

    const suburbs = []
    // Reuse one page, scraping sequentially with polite delay
    const page = await context.newPage()

    for (const suburb of SUBURBS) {
      const result = await scrapeSuburb(page, suburb)
      suburbs.push(result)
      process.stderr.write(`[railway-scraper] ${suburb.name}: median=${result.median} dom=${result.dom} clearance=${result.clearance}%\n`)
      if (SUBURBS.indexOf(suburb) < SUBURBS.length - 1) {
        await page.waitForTimeout(1500)
      }
    }

    await browser.close()

    process.stdout.write(JSON.stringify({
      ok: true,
      timestamp: new Date().toISOString(),
      suburbs,
    }) + '\n')
  } catch (err) {
    if (browser) await browser.close().catch(() => {})
    process.stdout.write(JSON.stringify({ ok: false, error: err.message }) + '\n')
    process.exit(1)
  }
}

main()
