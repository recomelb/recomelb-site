import { getSuburbData } from '@/lib/sheets'

export async function GET() {
  try {
    const rows = await getSuburbData()
    const suburbs = rows.map(r => ({
      name:      r.suburb,
      type:      r.type      || 'House',
      location:  r.location  || 'Inner Melbourne',
      tag:       r.heat      || '',
      median:    r.median,
      clearance: parseInt(r.clearance)  || 0,
      dom:       parseInt(r.dom)        || 0,
      change:    r.growth,
      up:        (r.growth  || '').startsWith('+'),
      trend:     [],
    }))
    return Response.json(suburbs)
  } catch {
    return Response.json([])
  }
}
