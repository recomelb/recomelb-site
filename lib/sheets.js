/**
 * Fetches data from a Google Sheet published as CSV.
 *
 * Each tab is published separately. Store each tab's CSV URL in .env.local:
 *   SHEET_SUBURBS_URL
 *   SHEET_COMMERCIAL_URL
 *   SHEET_BLOG_URL
 *   SHEET_DEAL_URL
 *
 * To publish a tab: File → Share → Publish to web →
 *   select the tab → CSV → Publish → copy URL
 */

async function fetchCSV(url, envKey) {
  if (!url) throw new Error(`Environment variable ${envKey} is not set`)

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`Failed to fetch ${envKey}: ${res.status} ${res.statusText}`)

  return res.text()
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'))

  return lines
    .slice(1)
    .filter(line => line.trim())
    .map(line => {
      // Handle quoted fields containing commas
      const values = []
      let current = ''
      let inQuotes = false
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes }
        else if (char === ',' && !inQuotes) { values.push(current.trim()); current = '' }
        else { current += char }
      }
      values.push(current.trim())

      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
    })
}

/**
 * Returns all residential suburb rows from the suburb_data tab.
 * Example row: { suburb, median, clearance, dom, growth, heat, stock, trend }
 */
export async function getSuburbData() {
  const text = await fetchCSV(process.env.SHEET_SUBURBS_URL, 'SHEET_SUBURBS_URL')
  return parseCSV(text)
}

/**
 * Returns all commercial precinct rows from the commercial_data tab.
 * Example row: { precinct, type, yield, vacancy, rent_psm, change, trend }
 */
export async function getCommercialData() {
  const text = await fetchCSV(process.env.SHEET_COMMERCIAL_URL, 'SHEET_COMMERCIAL_URL')
  return parseCSV(text)
}

/**
 * Returns blog posts where approved = Y from the blog_posts tab.
 * Example row: { title, excerpt, category, tag, date, read_time, approved }
 */
export async function getBlogPosts() {
  const text = await fetchCSV(process.env.SHEET_BLOG_URL, 'SHEET_BLOG_URL')
  const rows = parseCSV(text)
  return rows.filter(r => r.approved?.toUpperCase() === 'Y')
}

/**
 * Returns the single active deal row from the deal_of_week tab.
 * Active row is where active = Y (only one row should have this at a time).
 * Example row: { address, price, badge, why, median_house, median_unit, yield, growth, dom, active }
 */
export async function getDealOfWeek() {
  const text = await fetchCSV(process.env.SHEET_DEAL_URL, 'SHEET_DEAL_URL')
  const rows = parseCSV(text)
  return rows.find(r => r.active?.toUpperCase() === 'Y') ?? null
}
