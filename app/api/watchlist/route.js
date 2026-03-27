import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { email, suburb } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    console.log('[watchlist] url present:', !!url)
    console.log('[watchlist] key present:', !!key)
    console.log('[watchlist] key prefix:', key ? key.slice(0, 20) : 'none')

    if (!url || !key) {
      console.error('[watchlist] Supabase env vars not set')
      return Response.json({ error: 'Service unavailable.' }, { status: 503 })
    }

    const supabase = createClient(url, key)
    const { data, error } = await supabase.from('watchlist').insert({
      email,
      suburb: suburb || null,
    }).select()

    if (error) {
      console.error('[watchlist] FULL ERROR:', JSON.stringify(error))
      console.error('[watchlist] error.message:', error.message)
      console.error('[watchlist] error.code:', error.code)
      console.error('[watchlist] error.details:', error.details)
      console.error('[watchlist] error.hint:', error.hint)
      console.error('[watchlist] error.status:', error.status)
      return Response.json({
        error:   'Could not save. Please try again.',
        _debug:  error.message,
        _code:   error.code,
        _hint:   error.hint,
        _status: error.status,
      }, { status: 500 })
    }

    console.log('[watchlist] Success, inserted:', JSON.stringify(data))
    return Response.json({ success: true })
  } catch (err) {
    console.error('[watchlist] Unexpected exception:', err.message)
    console.error('[watchlist] Stack:', err.stack)
    return Response.json({
      error:  'Something went wrong. Please try again.',
      _debug: err.message,
    }, { status: 500 })
  }
}
