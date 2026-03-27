import Link from 'next/link'
import { getSuburbData } from '@/lib/sheets'

// "fitzroy-north" → "Fitzroy North"
function slugToName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// "Fitzroy North" → "fitzroy-north"
function nameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function formatMedian(raw) {
  const n = parseFloat(raw)
  if (!n) return null
  return '$' + (n / 1_000_000).toFixed(2) + 'M'
}

function formatChange(raw) {
  const n = parseFloat(raw)
  if (isNaN(n)) return null
  return (n >= 0 ? '+' : '') + n + '%'
}

function heatLabel(c) {
  if (c > 75)  return { label: 'Hot',  color: '#4ade80' }
  if (c >= 60) return { label: 'Warm', color: '#facc15' }
  return               { label: 'Cool', color: '#94a3b8' }
}

export async function generateMetadata({ params }) {
  const { suburb: slug } = await params
  const name = slugToName(slug)
  return { title: `${name} property data — RECOMELB` }
}

export default async function SuburbPage({ params }) {
  const { suburb: slug } = await params
  const displayName = slugToName(slug)

  // Fetch and match suburb data
  let suburb = null
  try {
    const rows = await getSuburbData()
    const raw = rows.find(r => nameToSlug(r.suburb || '') === slug)
    if (raw) {
      const change = parseFloat(raw.quarterly_change)
      suburb = {
        name:      raw.suburb,
        type:      raw.type ? raw.type.charAt(0).toUpperCase() + raw.type.slice(1).toLowerCase() : '',
        median:    formatMedian(raw.median_price),
        clearance: parseFloat(raw.clearance_rate) || 0,
        dom:       parseFloat(raw.dom) || 0,
        change:    formatChange(raw.quarterly_change),
        up:        !isNaN(change) && change >= 0,
        yield:     raw.rental_yield ? raw.rental_yield + '%' : null,
        tag:       raw.description || null,
      }
    }
  } catch {
    // Sheet unavailable — suburb stays null, shows fallback below
  }

  // Suburb not found in sheet at all
  if (suburb === null && slug) {
    // Check if it's genuinely not found vs sheet error by seeing if name looks valid
  }

  const heat = suburb ? heatLabel(suburb.clearance) : null

  return (
    <>
      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">Suburb profile · Inner Melbourne</div>
        <h1 className="page-hero-headline">
          {suburb ? suburb.name : displayName}
          {suburb?.type ? <><br /><em>{suburb.type} market</em></> : <><br /><em>Market data</em></>}
        </h1>
        {suburb?.tag && (
          <p className="page-hero-sub">{suburb.tag}</p>
        )}
        <Link href="/residential" className="btn-ghost" style={{ display: 'inline-block' }}>
          ← Back to all suburbs
        </Link>
      </div>

      {suburb ? (
        <>
          {/* STATS STRIP */}
          <section className="suburb-strip" style={{ paddingTop: '0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px,100%), 1fr))', gap: '1px', background: 'var(--navy-border)', border: '1px solid var(--navy-border)' }}>
              {[
                { label: 'Median price',    value: suburb.median    || '—' },
                { label: 'Clearance rate',  value: suburb.clearance ? `${suburb.clearance}%` : '—',
                  extra: heat && <span style={{ marginLeft: '8px', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: heat.color }}>{heat.label}</span> },
                { label: 'Days on market',  value: suburb.dom ? `${suburb.dom} days` : '—' },
                { label: 'Qtr price change', value: suburb.change || '—', color: suburb.up ? '#4ade80' : '#f87171' },
                suburb.yield ? { label: 'Rental yield', value: suburb.yield } : null,
              ].filter(Boolean).map(({ label, value, color, extra }) => (
                <div key={label} style={{ background: 'var(--navy-mid)', padding: '32px 28px' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>{label}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '300', color: color || 'var(--text-primary)' }}>
                    {value}{extra}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MARKET SIGNAL */}
          <section className="section-padded" style={{ padding: '64px 48px', borderTop: '1px solid var(--navy-border)', background: 'rgba(17,24,39,0.5)' }}>
            <div style={{ maxWidth: '640px' }}>
              <div className="section-eyebrow">Market context</div>
              <h2 className="section-title" style={{ marginBottom: '20px' }}>
                What the data says about {suburb.name}.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.8' }}>
                {suburb.clearance > 75
                  ? `${suburb.name} is running hot — a ${suburb.clearance}% clearance rate means most properties are selling at auction, and buyers are competing. Sellers are well-positioned right now.`
                  : suburb.clearance >= 60
                  ? `${suburb.name} shows a solid clearance rate of ${suburb.clearance}% — demand is healthy without being frenzied. A balanced market for both buyers and sellers.`
                  : `${suburb.name}'s clearance rate of ${suburb.clearance}% suggests softer demand — buyers may find more room to negotiate, and sellers should price carefully.`
                }
                {suburb.dom > 0 && ` Properties are averaging ${suburb.dom} days on market.`}
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="section-padded" style={{ padding: '64px 48px', borderTop: '1px solid var(--navy-border)' }}>
            <div style={{ maxWidth: '520px' }}>
              <div className="section-eyebrow">Full suburb data</div>
              <h2 className="section-title" style={{ marginBottom: '16px' }}>
                See all inner-ring suburbs side by side.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
                Compare {suburb.name} against every tracked suburb — clearance rates, medians, days on market and price trends in one table.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/residential" className="btn-primary">View all suburbs</Link>
                <Link href="/buyers" className="btn-ghost">Buyers guide</Link>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* NOT FOUND */
        <section className="section-padded" style={{ padding: '80px 48px' }}>
          <div style={{ maxWidth: '520px' }}>
            <div className="section-eyebrow">No data found</div>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>
              {displayName} isn&apos;t in our dataset yet.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
              We currently track Melbourne&apos;s inner-ring suburbs. {displayName} may be outside our coverage area or added soon.
            </p>
            <Link href="/residential" className="btn-primary">Browse tracked suburbs</Link>
          </div>
        </section>
      )}
    </>
  )
}
