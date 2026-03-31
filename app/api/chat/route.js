import { getSuburbData } from '@/lib/sheets'

const SYSTEM_PROMPT = `You are RECOMELB's property intelligence assistant for Melbourne. You have access to live suburb data including median prices, clearance rates, days on market and rental yields. Answer questions about Melbourne property clearly and concisely. Always reference specific data when available. Never give financial advice — instead give data-driven insights.`

const GEMINI_URL = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`

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

async function callGemini(model, apiKey, prompt) {
  const res = await fetch(GEMINI_URL(model, apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  const json = await res.json()

  if (!res.ok) {
    const err = new Error(json?.error?.message || `Gemini ${res.status}`)
    err.status = res.status
    err.geminiError = json?.error
    throw err
  }

  // Extract text from response
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
  const finishReason = json?.candidates?.[0]?.finishReason

  if (!text) {
    const err = new Error(`No text in response (finishReason: ${finishReason})`)
    err.status = 422
    err.finishReason = finishReason
    throw err
  }

  return text
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

    // Fetch live suburb data — fall back gracefully on sheet error
    let suburbContext = ''
    try {
      const rows = await getSuburbData()
      suburbContext = buildContext(rows)
      console.log('[chat] Sheet data loaded, rows:', rows.length)
    } catch (sheetErr) {
      console.warn('[chat] Sheet fetch failed:', sheetErr.message)
      suburbContext = 'Live suburb data temporarily unavailable.'
    }

    const fullPrompt = `${suburbContext}\n\n${context ? `Additional context: ${context}\n\n` : ''}User question: ${message.trim()}`
    console.log('[chat] Sending to Gemini, prompt length:', fullPrompt.length)

    // Try primary model, fall back to lite on rate limit
    let text
    try {
      text = await callGemini('gemini-2.0-flash', apiKey, fullPrompt)
    } catch (primaryErr) {
      console.error('[chat] gemini-2.0-flash failed — status:', primaryErr.status, 'message:', primaryErr.message)
      if (primaryErr.status === 429) {
        console.warn('[chat] Rate limited, retrying with gemini-2.0-flash-lite')
        text = await callGemini('gemini-2.0-flash-lite', apiKey, fullPrompt)
      } else {
        throw primaryErr
      }
    }

    console.log('[chat] Gemini responded, length:', text.length)
    return Response.json({ response: text })

  } catch (err) {
    console.error('[chat] ERROR status:', err.status)
    console.error('[chat] ERROR message:', err.message)
    console.error('[chat] ERROR geminiError:', JSON.stringify(err.geminiError ?? null))

    if (err.status === 429) {
      return Response.json({
        error: 'The assistant is busy right now — please try again in a moment.',
        _debug: { message: err.message, status: 429 },
      }, { status: 429 })
    }

    if (err.status === 422) {
      return Response.json({
        error: 'Response was blocked. Please rephrase your question.',
        _debug: { message: err.message, finishReason: err.finishReason },
      }, { status: 422 })
    }

    return Response.json({
      error: 'Something went wrong. Please try again.',
      _debug: { message: err.message, status: err.status ?? null },
    }, { status: 500 })
  }
}
