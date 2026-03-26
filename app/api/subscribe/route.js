export async function POST(request) {
  try {
    const { firstName, email } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const apiKey = process.env.BREVO_API_KEY
    const listId = parseInt(process.env.BREVO_LIST_ID)

    if (!apiKey || !listId) {
      console.error('[subscribe] Brevo env vars not set')
      return Response.json({ error: 'Subscription service unavailable.' }, { status: 503 })
    }

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key':      apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes:    { FIRSTNAME: firstName?.trim() || '' },
        listIds:       [listId],
        updateEnabled: true,
      }),
    })

    // 201 = new contact, 204 = existing contact updated
    if (res.status === 201 || res.status === 204) {
      return Response.json({ success: true })
    }

    const body = await res.json().catch(() => ({}))
    console.error('[subscribe] Brevo error', res.status, body)
    return Response.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 })

  } catch (err) {
    console.error('[subscribe] error:', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
