import { getSuburbData } from '@/lib/sheets'

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

export async function GET() {
  try {
    const rows = await getSuburbData()
    const suburbs = rows.map(r => {
      const change = parseFloat(r.quarterly_change)
      const trend = ['trend_1','trend_2','trend_3','trend_4','trend_5','trend_6']
        .map(k => parseFloat(r[k]) / 1_000_000)
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
