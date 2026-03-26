import { getDealOfWeek } from '@/lib/sheets'

export async function GET() {
  try {
    const row = await getDealOfWeek()
    if (!row) return Response.json(null)
    return Response.json({
      price:       row.price,
      address:     row.address,
      badge:       row.badge,
      why:         row.why,
      medianHouse: row.median_house,
      medianUnit:  row.median_unit,
      yield:       row.yield,
      growth:      row.growth,
      dom:         row.dom,
    })
  } catch {
    return Response.json(null)
  }
}
