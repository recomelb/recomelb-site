import { GoogleGenerativeAI } from '@google/generative-ai'
import { getSuburbData } from '@/lib/sheets'

const SYSTEM_PROMPT = `You are RECOMELB's property intelligence assistant for Melbourne. You have access to live suburb data including median prices, clearance rates, days on market and rental yields. Answer questions about Melbourne property clearly and concisely. Always reference specific data when available. Never give financial advice — instead give data-driven insights.`

function buildContext(rows) {
  if (!rows.length) return 'No suburb data currently available.'

  const lines = rows.map(r => {
    const parts = [r.suburb]
    if (r.median_price)    parts.push(`median $${(parseFloat(r.median_price) / 1_000_000).toFixed(2)}M`)
    if (r.clearance_rate)  parts.push(`clearance ${r.clearance_rate}%`)
    if (r.dom)             parts.push(`${r.dom} days on market`)
    if (r.rental_yield)    parts.push(`yield ${r.rental_yield}%`)
    if (r.quarterly_change) parts.push(`quarterly change ${r.quarterly_change}%`)
    return parts.join(', ')
  })

  return `Current Melbourne inner-ring suburb data:\n${lines.join('\n')}`
}

export async function POST(request) {
  try {
    const { message, context } = await request.json()

    if (!message || typeof message !== 'string' || !message.trim()) {
      return Response.json({ error: 'Message is required.' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'Chat service unavailable.' }, { status: 503 })
    }

    // Fetch live suburb data — fall back to empty context on sheet error
    let suburbContext = ''
    try {
      const rows = await getSuburbData()
      suburbContext = buildContext(rows)
    } catch {
      suburbContext = 'Live suburb data temporarily unavailable.'
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    // Build the full prompt with live data injected as context
    const fullPrompt = `${suburbContext}\n\n${context ? `Additional context: ${context}\n\n` : ''}User question: ${message.trim()}`

    const result = await model.generateContent(fullPrompt)
    const text = result.response.text()

    return Response.json({ response: text })
  } catch (err) {
    console.error('[chat] Error:', err.message)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
