/**
 * scripts/debug-domain.js
 * Dumps Domain suburb profile page content to understand structure.
 * Run: node scripts/debug-domain.js
 */

import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

await page.setExtraHTTPHeaders({
  'Accept-Language': 'en-AU,en;q=0.9',
})

console.log('Loading Domain Fitzroy profile...')
await page.goto('https://www.domain.com.au/suburb-profile/fitzroy-vic-3065/', {
  waitUntil: 'domcontentloaded',
  timeout: 30000,
})
await page.waitForTimeout(5000)

// Dump all text content from stat-looking elements
const stats = await page.$$eval('*', els =>
  els
    .filter(el => {
      const t = el.innerText?.trim()
      return t && t.length < 80 && (
        t.includes('$') || t.includes('%') || /\d+\s*(day|week)/i.test(t)
      )
    })
    .map(el => ({
      tag: el.tagName,
      class: el.className?.toString().slice(0, 80),
      text: el.innerText?.trim(),
    }))
    .slice(0, 60)
)

console.log('\n--- Stat-looking elements ---')
for (const s of stats) {
  console.log(`[${s.tag}] "${s.text}"`)
  if (s.class) console.log(`       class: ${s.class}`)
}

// Also search raw HTML for key JSON fields
const html = await page.content()
const patterns = [
  /"medianSalePrice"\s*:\s*[\d.]+/,
  /"medianPrice"\s*:\s*[\d.]+/,
  /"daysOnMarket"\s*:\s*\d+/,
  /"medianDaysOnMarket"\s*:\s*\d+/,
  /"rentalYield"\s*:\s*[\d.]+/,
  /"grossRentalYield"\s*:\s*[\d.]+/,
]

console.log('\n--- JSON fields in page source ---')
for (const p of patterns) {
  const m = html.match(p)
  console.log(m ? `FOUND: ${m[0]}` : `NOT FOUND: ${p}`)
}

await browser.close()
