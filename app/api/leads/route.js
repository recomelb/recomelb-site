export async function POST(request) {
  try {
    const { name, email, suburb, budget, timeline } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const apiKey = process.env.BREVO_API_KEY
    const listId = parseInt(process.env.BREVO_LIST_ID)

    if (!apiKey) {
      console.error('[leads] BREVO_API_KEY not set')
      return Response.json({ error: 'Service unavailable.' }, { status: 503 })
    }

    const parts     = (name || '').trim().split(' ')
    const firstName = parts[0] || ''
    const lastName  = parts.slice(1).join(' ') || ''

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method:  'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME:  lastName,
          SUBURB:    suburb  || '',
          BUDGET:    budget  || '',
          TIMELINE:  timeline || '',
        },
        listIds:       listId ? [listId] : [],
        updateEnabled: true,
      }),
    })

    if (res.status === 201 || res.status === 204) {
      return Response.json({ success: true })
    }

    const body = await res.json().catch(() => ({}))
    console.error('[leads] Brevo error', res.status, body)
    return Response.json({ error: 'Could not save lead. Please try again.' }, { status: 500 })

  } catch (err) {
    console.error('[leads] error:', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
