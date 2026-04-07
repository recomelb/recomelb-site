/**
 * scripts/update-sheet.js
 *
 * Scrapes Domain suburb profiles for all 10 suburbs and writes the results
 * directly to the suburb_data tab of the Google Sheet.
 *
 * Usage:
 *   node scripts/update-sheet.js
 *
 * Required environment variables (set in .env.local for local runs,
 * or as GitHub Actions secrets for automated runs):
 *
 *   GOOGLE_SHEET_ID              — the sheet ID from the URL
 *                                  (https://docs.google.com/spreadsheets/d/<ID>/edit)
 *
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — the full JSON key for a Google Service Account
 *                                  that has been granted Editor access to the sheet.
 *                                  Paste the entire JSON as a single-line string.
 *
 * One-time Google setup:
 *   1. console.cloud.google.com → new project → enable "Google Sheets API"
 *   2. IAM → Service Accounts → create account → create JSON key → download
 *   3. Open your Google Sheet → Share → paste the service account email → Editor
 *   4. Add the downloaded JSON as GOOGLE_SERVICE_ACCOUNT_KEY (the whole file content)
 */

import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

import { google } from 'googleapis'
import { runScraper } from '../lib/scraper.js'

// ─── Auth ─────────────────────────────────────────────────────────────────────

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

if (!SHEET_ID) {
  console.error('Missing GOOGLE_SHEET_ID environment variable.')
  process.exit(1)
}
if (!SERVICE_ACCOUNT_JSON) {
  console.error('Missing GOOGLE_SERVICE_ACCOUNT_JSON environment variable.')
  process.exit(1)
}

let credentials
try {
  credentials = JSON.parse(SERVICE_ACCOUNT_JSON)
} catch {
  console.error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.')
  process.exit(1)
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
const sheetsClient = google.sheets({ version: 'v4', auth })

// ─── Sheet helpers ────────────────────────────────────────────────────────────

const TAB = 'suburb_data'

/**
 * Read column A of suburb_data to build a map of suburb name → 1-based row index.
 * Row 1 is the header, so data starts at row 2.
 */
async function getSuburbRowMap() {
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:A`,
  })

  const rows = res.data.values ?? []
  const map = {}
  // rows[0] is the header row — skip it
  for (let i = 1; i < rows.length; i++) {
    const name = rows[i]?.[0]?.trim()
    if (name) map[name] = i + 1  // +1 because Sheets rows are 1-indexed
  }
  return map
}

/**
 * Write scraped results to the sheet.
 * Columns: suburb(A) | median_price(B) | dom(C) | clearance_rate(D) | rental_yield(E) | quarterly_change(F)
 * We update B–F for each matching suburb row.
 */
async function writeResultsToSheet(results) {
  const rowMap = await getSuburbRowMap()

  const data = []
  const skipped = []

  for (const r of results) {
    const rowNum = rowMap[r.suburb]
    if (!rowNum) {
      skipped.push(r.suburb)
      continue
    }
    data.push({
      range: `${TAB}!B${rowNum}:F${rowNum}`,
      values: [[
        r.median_price      ?? '',
        r.dom               ?? '',
        r.clearance_rate    ?? '',
        r.rental_yield      ?? '',
        r.quarterly_change  ?? '',
      ]],
    })
  }

  if (data.length === 0) {
    console.error('No matching suburbs found in sheet. Check suburb names match column A exactly.')
    process.exit(1)
  }

  await sheetsClient.spreadsheets.values.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data,
    },
  })

  return { updated: data.length, skipped }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('='.repeat(60))
console.log('RECOMELB Sheet Updater')
console.log('='.repeat(60))
console.log(`Sheet: ${SHEET_ID}`)
console.log(`Tab:   ${TAB}`)
console.log('')

const start = Date.now()

// 1. Scrape
console.log('Step 1/2 — Scraping suburb data...')
const { results, errors } = await runScraper({ headless: true })

if (errors.length) {
  console.warn('Scrape warnings:')
  errors.forEach(e => console.warn(' ', e))
}

const populated = results.filter(r => r.median_price || r.dom || r.clearance_rate).length
console.log(`Scraped: ${populated}/${results.length} suburbs with at least one data point`)
console.log('')

// 2. Write to sheet
console.log('Step 2/2 — Writing to Google Sheet...')
const { updated, skipped } = await writeResultsToSheet(results)

const elapsed = ((Date.now() - start) / 1000).toFixed(1)

console.log('')
console.log('='.repeat(60))
console.log(`Done in ${elapsed}s`)
console.log(`Updated: ${updated} rows`)
if (skipped.length) console.log(`Skipped (not in sheet): ${skipped.join(', ')}`)
console.log('='.repeat(60))
