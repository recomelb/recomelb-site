/**
 * POST /api/update-suburb-data
 *
 * Automated data pipeline — fetches median prices, DOM, and rental yield
 * for Melbourne inner-ring suburbs and writes them to the Google Sheet.
 *
 * Required env vars:
 *   UPDATE_API_KEY              — secret token, sent as x-api-key header
 *   GOOGLE_SHEET_ID             — the actual spreadsheet ID (from the URL:
 *                                  docs.google.com/spreadsheets/d/<ID>/edit)
 *   GOOGLE_SERVICE_ACCOUNT_JSON — full service account JSON as a string
 *                                  (created in Google Cloud Console; share
 *                                   the sheet with the service account email)
 *
 * Optional:
 *   VIC_GOV_RESOURCE_ID — CKAN resource ID for VIC property sales dataset
 *                          (defaults to the quarterly residential stats resource)
 *
 * Called by n8n weekly workflow (see /n8n/update-suburb-workflow.json)
 */

import { google } from 'googleapis'

// Vercel Pro: allow up to 60s for scraping + sheet write
export const maxDuration = 60

// ─── Suburb definitions ──────────────────────────────────────────────────────

const SUBURBS = [
  { name: 'Fitzroy',       postcode: '3065', domainSlug: 'fitzroy-vic-3065',       vicName: 'FITZROY' },
  { name: 'Collingwood',   postcode: '3066', domainSlug: 'collingwood-vic-3066',   vicName: 'COLLINGWOOD' },
  { name: 'Richmond',      postcode: '3121', domainSlug: 'richmond-vic-3121',       vicName: 'RICHMOND' },
  { name: 'Northcote',     postcode: '3070', domainSlug: 'northcote-vic-3070',      vicName: 'NORTHCOTE' },
  { name: 'Brunswick',     postcode: '3056', domainSlug: 'brunswick-vic-3056',      vicName: 'BRUNSWICK' },
  { name: 'Abbotsford',    postcode: '3067', domainSlug: 'abbotsford-vic-3067',     vicName: 'ABBOTSFORD' },
  { name: 'Fitzroy North', postcode: '3068', domainSlug: 'fitzroy-north-vic-3068',  vicName: 'FITZROY NORTH' },
  { name: 'Carlton',       postcode: '3053', domainSlug: 'carlton-vic-3053',        vicName: 'CARLTON' },
  { name: 'Prahran',       postcode: '3181', domainSlug: 'prahran-vic-3181',        vicName: 'PRAHRAN' },
  { name: 'South Yarra',   postcode: '3141', domainSlug: 'south-yarra-vic-3141',    vicName: 'SOUTH YARRA' },
]

// Browser-like headers — Domain and land.vic.gov.au both block bare fetch()
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-AU,en;q=0.9',
  'Cache-Control': 'no-cache',
}

// ─── Section 1: VIC Gov median prices ────────────────────────────────────────

/**
 * Try data.vic.gov.au CKAN API first, then fall back to scraping the
 * land.vic.gov.au page to find the latest CSV download link.
 *
 * Returns: { 'Fitzroy': { median, quarterly_change }, ... }
 */
async function fetchVicMedianPrices() {
  const results = {}

  // Attempt 1: CKAN datastore API
  try {
    const resourceId = process.env.VIC_GOV_RESOURCE_ID || '9589df03-3b7c-4e06-94af-f3e28aa69eec'
    const url = `https://discover.data.vic.gov.au/api/3/action/datastore_search?resource_id=${resourceId}&limit=5000`

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) throw new Error(`CKAN ${res.status}`)

    const json = await res.json()
    if (!json.success) throw new Error('CKAN returned success:false')

    const records = json.result?.records || []
    console.log(`[update-suburb-data] CKAN returned ${records.length} records`)

    for (const suburb of SUBURBS) {
      // VIC gov data uses uppercase suburb names
      const match = records.find(r => {
        const rSuburb = (r.Suburb || r.suburb || r.SUBURB || '').trim().toUpperCase()
        return rSuburb === suburb.vicName
      })

      if (match) {
        // Field names vary by dataset version — try common variants
        const median = parseFloat(
          match.MedianSalePrice || match.median_sale_price || match.Median_Price ||
          match.median_price || match.Median || 0
        )
        const prevMedian = parseFloat(
          match.PrevMedianSalePrice || match.prev_median_sale_price ||
          match.PreviousMedian || match.prev_median || median
        )
        const change = median && prevMedian
          ? (((median - prevMedian) / prevMedian) * 100).toFixed(1)
          : null

        results[suburb.name] = { median: median || null, quarterly_change: change }
      }
    }

    console.log(`[update-suburb-data] VIC CKAN: matched ${Object.keys(results).length}/${SUBURBS.length} suburbs`)
  } catch (err) {
    console.warn('[update-suburb-data] CKAN API failed:', err.message)

    // Attempt 2: scrape land.vic.gov.au page for download link
    try {
      await fetchVicGovPageFallback(results)
    } catch (fallbackErr) {
      console.warn('[update-suburb-data] VIC Gov page fallback also failed:', fallbackErr.message)
      // Proceed — median prices will be null; DOM + yield still fetched from Domain
    }
  }

  return results
}

/**
 * Scrape land.vic.gov.au to find the latest quarterly stats CSV/Excel URL.
 * Note: parsing Excel requires the 'xlsx' package (not installed).
 * This function finds and logs the URL; add xlsx parsing if needed.
 */
async function fetchVicGovPageFallback(results) {
  const pageUrl = 'https://www.land.vic.gov.au/land-registration/land-data-and-reporting/property-sales-statistics'
  const res = await fetch(pageUrl, { headers: BROWSER_HEADERS, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`land.vic.gov.au returned ${res.status}`)

  const html = await res.text()

  // Find download links for CSV or Excel files
  const linkPattern = /href="([^"]*(?:property[-_]sales|residential|quarterly)[^"]*\.(?:csv|xlsx?))"[^>]*>/gi
  const matches = [...html.matchAll(linkPattern)]

  if (!matches.length) {
    throw new Error('No CSV/Excel download link found on land.vic.gov.au')
  }

  const csvHref = matches[0][1]
  const csvUrl = csvHref.startsWith('http') ? csvHref : `https://www.land.vic.gov.au${csvHref}`

  // Log the URL — to parse it, install 'xlsx' package and add parsing here
  console.log('[update-suburb-data] VIC Gov CSV found at:', csvUrl)
  console.log('[update-suburb-data] Install "xlsx" package to parse this file automatically')
  // void results — no data written in this fallback path without xlsx parsing
}

// ─── Section 2: Domain suburb profile scraping ───────────────────────────────

/**
 * Scrape a single Domain suburb profile page for days-on-market and rental yield.
 * Domain embeds structured data as JSON in <script> tags and inline data attributes.
 */
async function fetchDomainSuburb(slug) {
  const url = `https://www.domain.com.au/suburb-profile/${slug}/`

  try {
    const res = await fetch(url, {
      headers: {
        ...BROWSER_HEADERS,
        Referer: 'https://www.domain.com.au/',
      },
      signal: AbortSignal.timeout(12000),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const html = await res.text()

    // Domain embeds page data as JSON in multiple script blocks.
    // We search the full HTML text for the known field names.
    let dom = null
    let rentalYield = null

    // Pattern A: JSON field in script data (most reliable)
    const domPatterns = [
      /"daysOnMarket"\s*:\s*(\d+)/,
      /"medianDaysOnMarket"\s*:\s*(\d+)/,
      /Days\s+on\s+market[^<]{0,80}?(\d{1,3})/i,
      /(\d{1,3})\s*<[^>]*>\s*Days\s+on\s+market/i,
    ]
    for (const pat of domPatterns) {
      const m = html.match(pat)
      if (m) { dom = parseInt(m[1]); break }
    }

    const yieldPatterns = [
      /"rentalYield"\s*:\s*([\d.]+)/,
      /"grossRentalYield"\s*:\s*([\d.]+)/,
      /Rental\s+yield[^<]{0,80}?([\d.]+)\s*%/i,
      /([\d.]+)%\s*<[^>]*>\s*Rental\s+yield/i,
    ]
    for (const pat of yieldPatterns) {
      const m = html.match(pat)
      if (m) { rentalYield = parseFloat(m[1]); break }
    }

    return { dom, rental_yield: rentalYield }
  } catch (err) {
    console.warn(`[update-suburb-data] Domain scrape failed for ${slug}: ${err.message}`)
    return { dom: null, rental_yield: null }
  }
}

/**
 * Scrape all suburbs in batches of 3 with a polite delay between batches.
 */
async function fetchAllDomainData() {
  const results = {}
  const BATCH = 3
  const DELAY = 1200 // ms between batches

  for (let i = 0; i < SUBURBS.length; i += BATCH) {
    const batch = SUBURBS.slice(i, i + BATCH)
    const fetched = await Promise.all(batch.map(s => fetchDomainSuburb(s.domainSlug)))
    batch.forEach((s, idx) => { results[s.name] = fetched[idx] })

    if (i + BATCH < SUBURBS.length) {
      await new Promise(r => setTimeout(r, DELAY))
    }
  }

  console.log(`[update-suburb-data] Domain: scraped ${Object.keys(results).length} suburbs`)
  return results
}

// ─── Section 3: Google Sheets write ──────────────────────────────────────────

/** Convert 0-based column index to sheet letter (A, B, ..., Z, AA, ...) */
function colLetter(index) {
  let letter = ''
  let n = index
  while (n >= 0) {
    letter = String.fromCharCode((n % 26) + 65) + letter
    n = Math.floor(n / 26) - 1
  }
  return letter
}

/** Build JWT auth from service account JSON stored in env var */
function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var not set')

  let creds
  try { creds = JSON.parse(raw) } catch { throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON') }

  return new google.auth.JWT(
    creds.client_email,
    null,
    creds.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  )
}

/**
 * Read all rows from suburb_data sheet tab.
 * Returns array of arrays (row 0 = headers).
 */
async function readSheetRows(sheets, spreadsheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'suburb_data!A1:Z200',
  })
  return res.data.values || []
}

/**
 * Write merged suburb data back to the sheet.
 * Updates: median_price, quarterly_change, dom, rental_yield, trend_1..trend_6
 * Skips: clearance_rate (manual weekly input)
 *
 * Trend shift: [t1,t2,t3,t4,t5,t6] → [t2,t3,t4,t5,t6,new_median]
 */
async function writeSheetUpdates(sheets, spreadsheetId, rows, suburbResults) {
  if (!rows.length) throw new Error('Sheet is empty — no header row found')

  const headers = rows[0].map(h => h?.trim().toLowerCase().replace(/\s+/g, '_'))

  const idx = (col) => headers.indexOf(col)
  const suburbCol   = idx('suburb')
  const medianCol   = idx('median_price')
  const changeCol   = idx('quarterly_change')
  const domCol      = idx('dom')
  const yieldCol    = idx('rental_yield')
  const trendCols   = [1,2,3,4,5,6].map(n => idx(`trend_${n}`))

  if (suburbCol === -1) throw new Error(`"suburb" column not found. Headers: ${headers.join(', ')}`)

  const updates = [] // { range, values } pairs for batchUpdate

  for (const result of suburbResults) {
    // Find the sheet row for this suburb (rowIdx is 0-based into the rows array)
    const rowIdx = rows.findIndex((r, i) =>
      i > 0 && r[suburbCol]?.trim().toLowerCase() === result.name.toLowerCase()
    )

    if (rowIdx === -1) {
      console.warn(`[update-suburb-data] Sheet row not found for suburb: ${result.name}`)
      continue
    }

    const sheetRow = rowIdx + 1 // 1-indexed sheet row number (header is row 1, so data starts at 2)
    const row = rows[rowIdx]

    const addCell = (colIdx, value) => {
      if (colIdx === -1 || value === null || value === undefined) return
      updates.push({ range: `suburb_data!${colLetter(colIdx)}${sheetRow}`, values: [[value]] })
    }

    addCell(medianCol,  result.median)
    addCell(changeCol,  result.quarterly_change)
    addCell(domCol,     result.dom)
    addCell(yieldCol,   result.rental_yield)

    // Shift trend columns and append new median as trend_6
    if (result.median != null && trendCols.every(c => c !== -1)) {
      const current = trendCols.map(c => parseFloat(row[c]) || 0)
      const shifted  = [...current.slice(1), result.median]
      trendCols.forEach((colIdx, i) => addCell(colIdx, shifted[i]))
    }
  }

  if (!updates.length) {
    console.log('[update-suburb-data] No sheet cells to update')
    return 0
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'RAW',
      data: updates,
    },
  })

  console.log(`[update-suburb-data] Wrote ${updates.length} cells to sheet`)
  return updates.length
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const apiKey = request.headers.get('x-api-key')
  const expectedKey = process.env.UPDATE_API_KEY

  if (!expectedKey) {
    console.error('[update-suburb-data] UPDATE_API_KEY env var not set')
    return Response.json({ error: 'Server misconfiguration' }, { status: 500 })
  }
  if (!apiKey || apiKey !== expectedKey) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const timestamp = new Date().toISOString()
  const errors = []

  // ── 1. Fetch median prices from VIC Government ────────────────────────────
  console.log('[update-suburb-data] Step 1: fetching VIC median prices')
  const vicData = await fetchVicMedianPrices()

  // ── 2. Scrape Domain for DOM + rental yield ───────────────────────────────
  console.log('[update-suburb-data] Step 2: scraping Domain suburb profiles')
  const domainData = await fetchAllDomainData()

  // ── 3. Merge into unified result array ────────────────────────────────────
  const results = SUBURBS.map(suburb => ({
    name:             suburb.name,
    median:           vicData[suburb.name]?.median           ?? null,
    quarterly_change: vicData[suburb.name]?.quarterly_change ?? null,
    dom:              domainData[suburb.name]?.dom            ?? null,
    rental_yield:     domainData[suburb.name]?.rental_yield  ?? null,
  }))

  const dataFetched = results.filter(r => r.median || r.dom || r.rental_yield).length
  console.log(`[update-suburb-data] Merged data for ${dataFetched}/${SUBURBS.length} suburbs`)

  // ── 4. Write to Google Sheet ──────────────────────────────────────────────
  let cellsUpdated = 0
  const spreadsheetId = process.env.GOOGLE_SHEET_ID

  if (!spreadsheetId) {
    errors.push('GOOGLE_SHEET_ID not set — sheet write skipped')
    console.warn('[update-suburb-data] GOOGLE_SHEET_ID missing, skipping sheet write')
  } else {
    try {
      console.log('[update-suburb-data] Step 3: writing to Google Sheet')
      const auth   = getAuth()
      const sheets = google.sheets({ version: 'v4', auth })
      const rows   = await readSheetRows(sheets, spreadsheetId)
      cellsUpdated = await writeSheetUpdates(sheets, spreadsheetId, rows, results)
    } catch (err) {
      const msg = err.message
      errors.push(`Sheet write failed: ${msg}`)
      console.error('[update-suburb-data] Sheet write error:', msg)
    }
  }

  // ── 5. Return summary ─────────────────────────────────────────────────────
  return Response.json({
    updated:       dataFetched,
    cells_updated: cellsUpdated,
    timestamp,
    ...(errors.length ? { errors } : {}),
    data: results,
  })
}
