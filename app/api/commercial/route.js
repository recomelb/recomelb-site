import { getCommercialData } from '@/lib/sheets'

export async function GET() {
  try {
    const rows = await getCommercialData()
    const precincts = rows.map(r => ({
      name:    r.precinct,
      sub:     r.sub      || '',
      type:    r.type,
      yield:   r.yield,
      vacancy: r.vacancy,
      rent:    r.rent_psm,
      change:  r.change,
      up:      r.trend === 'up' || (r.change || '').startsWith('+'),
      bar:     Math.round(parseFloat(r.yield) * 10) || 50,
    }))
    return Response.json(precincts)
  } catch {
    return Response.json([])
  }
}
