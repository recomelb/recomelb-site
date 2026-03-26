import { getCommercialData } from '@/lib/sheets'

function formatChange(raw) {
  const n = parseFloat(raw)
  if (isNaN(n)) return ''
  return (n >= 0 ? '+' : '') + n + '%'
}

export async function GET() {
  try {
    const rows = await getCommercialData()
    const precincts = rows.map(r => {
      const change = parseFloat(r.quarterly_change)
      return {
        name:    r.precinct,
        sub:     r.description || '',
        type:    r.asset_class,
        yield:   parseFloat(r.net_yield) ? parseFloat(r.net_yield) + '%' : '',
        vacancy: parseFloat(r.vacancy_rate) ? parseFloat(r.vacancy_rate) + '%' : '',
        rent:    parseFloat(r.avg_rent_sqm) ? '$' + parseFloat(r.avg_rent_sqm) + '/m²' : '',
        change:  formatChange(r.quarterly_change),
        up:      !isNaN(change) && change >= 0,
        bar:     Math.round(parseFloat(r.net_yield) * 10) || 50,
      }
    })
    return Response.json(precincts)
  } catch {
    return Response.json([])
  }
}
