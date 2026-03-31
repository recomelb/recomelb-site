import { GoogleGenerativeAI } from '@google/generative-ai'
import { getSuburbData } from '@/lib/sheets'

const SYSTEM_PROMPT = `You are RECOMELB's property intelligence assistant for Melbourne. You have access to live suburb data including median prices, clearance rates, days on market and rental yields. Answer questions about Melbourne property clearly and concisely. Always reference specific data when available. Never give financial advice — instead give data-driven insights.`

function buildContext(rows) {
  if (!rows.length) return 'No suburb data currently available.'

  const lines = rows.map(r => {
    const parts = [r.suburb]
    if (r.median_price)     parts.push(`median $${(parseFloat(r.median_price) / 1_000_000).toFixed(2)}M`)
    if (r.clearance_rate)   parts.push(`clearance ${r.clearance_rate}%`)
    if (r.dom)              parts.push(`${r.dom} days on market`)
    if (r.rental_yield)     parts.push(`yield ${r.rental_yield}%`)
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
      console.error('[chat] GEMINI_API_KEY is not set')
      return Response.json({ error: 'Chat service unavailable.' }, { status: 503 })
    }

    console.log('[chat] API key present, length:', apiKey.length, 'prefix:', apiKey.slice(0, 8))

    // Fetch live suburb data — fall back to empty context on sheet error
    let suburbContext = ''
    try {
      const rows = await getSuburbData()
      suburbContext = buildContext(rows)
      console.log('[chat] Sheet data loaded, rows:', rows.length)
    } catch (sheetErr) {
      console.warn('[chat] Sheet fetch failed:', sheetErr.message)
      suburbContext = 'Live suburb data temporarily unavailable.'
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    // Try primary model, fall back to lite if primary is rate-limited
    const fullPrompt = `${suburbContext}\n\n${context ? `Additional context: ${context}\n\n` : ''}User question: ${message.trim()}`
    console.log('[chat] Sending to Gemini, prompt length:', fullPrompt.length)

    let result
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction: SYSTEM_PROMPT })
      result = await model.generateContent(fullPrompt)
    } catch (primaryErr) {
      if (primaryErr.status === 429) {
        console.warn('[chat] gemini-2.0-flash rate limited, trying gemini-2.0-flash-lite')
        const lite = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite', systemInstruction: SYSTEM_PROMPT })
        result = await lite.generateContent(fullPrompt)
      } else {
        throw primaryErr
      }
    }

    // result.response.text() throws if the response was blocked by safety filters
    let text
    try {
      text = result.response.text()
    } catch (textErr) {
      console.error('[chat] response.text() threw — likely safety block:', textErr.message)
      console.error('[chat] finishReason:', result.response?.candidates?.[0]?.finishReason)
      return Response.json({ error: 'Response was blocked. Please rephrase your question.' }, { status: 422 })
    }

    console.log('[chat] Gemini responded, response length:', text.length)
    return Response.json({ response: text })

  } catch (err) {
    // Log every available field — GoogleGenerativeAIFetchError has status + statusText
    console.error('[chat] ERROR name:', err.name)
    console.error('[chat] ERROR message:', err.message)
    console.error('[chat] ERROR status:', err.status)
    console.error('[chat] ERROR statusText:', err.statusText)
    console.error('[chat] ERROR errorDetails:', JSON.stringify(err.errorDetails ?? null))
    console.error('[chat] ERROR stack:', err.stack)

    if (err.status === 429) {
      return Response.json({
        error: 'The assistant is busy right now — please try again in a moment.',
        _debug: { name: err.name, message: err.message, status: 429 },
      }, { status: 429 })
    }

    return Response.json({
      error: 'Something went wrong. Please try again.',
      _debug: {
        name:    err.name,
        message: err.message,
        status:  err.status ?? null,
      },
    }, { status: 500 })
  }
}
