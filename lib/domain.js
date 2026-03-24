const TOKEN_URL = 'https://auth.domain.com.au/v1/connect/token'
const API_BASE  = 'https://api.domain.com.au/v1'

let cachedToken = null
let tokenExpiry  = 0

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     process.env.DOMAIN_CLIENT_ID,
      client_secret: process.env.DOMAIN_CLIENT_SECRET,
      scope:         'api_listings_read api_agencies_read',
    }),
  })

  if (!res.ok) {
    throw new Error(`Domain auth failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiry  = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

async function domainFetch(path, params = {}) {
  const token = await getAccessToken()
  const url   = new URL(`${API_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Domain API error ${res.status} for ${path}: ${await res.text()}`)
  }

  return res.json()
}

/**
 * Fetch current residential listings for a given suburb.
 * @param {string} suburb  e.g. "Fitzroy"
 * @param {object} opts    Optional overrides: { state, postcode, listingType, pageSize }
 */
export async function getListings(suburb, opts = {}) {
  const {
    state       = 'VIC',
    postcode    = '',
    listingType = 'Sale',
    pageSize    = 20,
  } = opts

  return domainFetch('/listings/residential/_search', {
    suburb,
    state,
    ...(postcode && { postcode }),
    listingType,
    pageSize,
  })
}

/**
 * Fetch suburb statistics (median price, clearance rate, days on market, etc.)
 * @param {string} suburb  e.g. "Fitzroy"
 * @param {string} state   defaults to "VIC"
 */
export async function getSuburbData(suburb, state = 'VIC') {
  return domainFetch('/suburbPerformanceStatistics', {
    suburb,
    state,
    propertyCategory: 'House',
    bedrooms:         3,
    periodSize:       1,
    startingPeriodRelativeToCurrent: 1,
    totalPeriods:     12,
  })
}
