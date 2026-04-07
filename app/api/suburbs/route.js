import { google } from 'googleapis'

function formatMedian(raw) {
  const n = parseFloat(raw)
  if (!n) return ''
  return '$' + (n / 1_000_000).toFixed(2) + 'M'
}

function formatChange(raw) {
  const n = parseFloat(raw)
  if (isNaN(n)) return ''
  return (n >= 0 ? '+' : '') + n + '%'
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''
}

export const revalidate = 3600  // cache for 1 hour

export async function GET() {
  try {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!raw || !spreadsheetId) return Response.json([])

    const creds = JSON.parse(raw)
    const auth = new google.auth.JWT(
      creds.client_email,
      null,
      creds.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    )
    const sheetsClient = google.sheets({ version: 'v4', auth })

    const res = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: 'suburb_data!A1:Z200',
    })

    const rows = res.data.values ?? []
    if (rows.length < 2) return Response.json([])

    const headers = rows[0].map(h => h?.trim().toLowerCase().replace(/\s+/g, '_'))
    const dataRows = rows.slice(1).filter(r => r.length > 0 && r[0]?.trim())

    const suburbs = dataRows.map(row => {
      const r = Object.fromEntries(headers.map((h, i) => [h, row[i] ?? '']))
      const change = parseFloat(r.quarterly_change)
      const trend = [1, 2, 3, 4, 5, 6]
        .map(n => parseFloat(r[`trend_${n}`]) / 1_000_000)
        .filter(v => !isNaN(v))

      return {
        name:      r.suburb,
        type:      capitalize(r.type),
        location:  'Inner Melbourne',
        tag:       r.description || '',
        median:    formatMedian(r.median_price),
        clearance: parseFloat(r.clearance_rate) || 0,
        dom:       parseFloat(r.dom)            || 0,
        change:    formatChange(r.quarterly_change),
        up:        !isNaN(change) && change >= 0,
        yield:     r.rental_yield ? r.rental_yield + '%' : '',
        trend,
      }
    })

    return Response.json(suburbs)
  } catch {
    return Response.json([])
  }
}
