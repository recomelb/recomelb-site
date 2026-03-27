import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
)

export async function POST(request) {
  try {
    const { email, suburb } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const { error } = await supabase.from('watchlist').insert({
      email,
      suburb: suburb || null,
    })

    if (error) {
      console.error('[watchlist] Supabase error:', error)
      return Response.json({ error: 'Could not save. Please try again.' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[watchlist] error:', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
