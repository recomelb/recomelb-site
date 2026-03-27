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
      console.error('[watchlist] Supabase insert error:', {
        message: error.message,
        code:    error.code,
        details: error.details,
        hint:    error.hint,
      })
      return Response.json({
        error:  'Could not save. Please try again.',
        _debug: error.message,
      }, { status: 500 })
    }

    console.log('[watchlist] Inserted row:', data)
    return Response.json({ success: true })
  } catch (err) {
    console.error('[watchlist] Unexpected error:', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
