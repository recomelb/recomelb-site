/**
 * scripts/test-scraper.js
 *
 * Run: node scripts/test-scraper.js
 *
 * Tests the full scraper pipeline without writing to the Google Sheet.
 * Set WRITE_SHEET=1 to also test the sheet write.
 */

import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

import { runScraper } from '../lib/scraper.js'

console.log('='.repeat(60))
console.log('RECOMELB Scraper Test')
console.log('='.repeat(60))
console.log('Sheet writes handled by n8n — this script tests data collection only.')
console.log('')

const start = Date.now()

try {
  const { results, errors } = await runScraper({ headless: true })

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)

  console.log('')
  console.log('='.repeat(60))
  console.log(`RESULTS (${elapsed}s)`)
  console.log('='.repeat(60))

  console.log('')
  console.log('Suburb Data:')
  console.log('-'.repeat(60))

  const colW = [16, 12, 6, 8, 12]
  const header = [
    'Suburb'.padEnd(colW[0]),
    'Median'.padEnd(colW[1]),
    'DOM'.padEnd(colW[2]),
    'Yield'.padEnd(colW[3]),
    'Clearance'.padEnd(colW[4]),
  ].join(' ')
  console.log(header)
  console.log('-'.repeat(60))

  for (const r of results) {
    const median = r.median ? `$${(r.median / 1_000_000).toFixed(2)}M` : '—'
    const dom    = r.dom    ? `${r.dom}d`                               : '—'
    const yld    = r.rental_yield ? `${r.rental_yield}%`               : '—'
    const clr    = r.clearance    ? `${r.clearance}%`                  : '—'

    console.log([
      r.name.padEnd(colW[0]),
      median.padEnd(colW[1]),
      dom.padEnd(colW[2]),
      yld.padEnd(colW[3]),
      clr.padEnd(colW[4]),
    ].join(' '))
  }

  const populated = results.filter(r => r.median || r.dom || r.rental_yield || r.clearance).length
  console.log('')
  console.log(`Coverage: ${populated}/${results.length} suburbs have at least one data point`)

  if (errors.length) {
    console.log('')
    console.log('Errors:')
    errors.forEach(e => console.log('  ✗', e))
  } else {
    console.log('')
    console.log('No errors.')
  }

  console.log('='.repeat(60))
} catch (err) {
  console.error('Fatal error:', err.message)
  console.error(err.stack)
  process.exit(1)
}
