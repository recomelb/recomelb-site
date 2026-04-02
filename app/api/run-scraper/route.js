/**
 * POST /api/run-scraper
 *
 * Runs the Playwright scraper and returns structured suburb data as JSON.
 * Sheet writing is handled downstream by n8n's Google Sheets node.
 *
 * Auth: x-api-key header must match UPDATE_API_KEY env var.
 *
 * Response: {
 *   timestamp: string,
 *   suburbs: [{ name, median, dom, clearance, rental_yield }, ...],
 *   errors: string[]
 * }
 *
 * NOTE: Playwright requires a real browser environment.
 * This route works when self-hosted (VPS, local dev server).
 * It will not run on Vercel serverless — call it from n8n pointed at
 * your local or self-hosted Next.js instance.
 */

import { runScraper } from '@/lib/scraper'

export const maxDuration = 120 // 2 min — scraping 10 suburbs takes ~70s

export async function POST(request) {
  const apiKey = request.headers.get('x-api-key')
  const expectedKey = process.env.UPDATE_API_KEY

  if (!expectedKey) {
    return Response.json({ error: 'Server misconfiguration: UPDATE_API_KEY not set' }, { status: 500 })
  }
  if (!apiKey || apiKey !== expectedKey) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[run-scraper] Starting scrape...')
  const start = Date.now()

  const { results, errors } = await runScraper({ headless: true })

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`[run-scraper] Done in ${elapsed}s — ${results.filter(r => r.median).length}/10 suburbs with median data`)

  return Response.json({
    timestamp: new Date().toISOString(),
    elapsed_seconds: parseFloat(elapsed),
    suburbs: results,
    ...(errors.length ? { errors } : {}),
  })
}
