'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const STATIC_SUBURBS = [
  { name: 'Fitzroy North', clearance: 77, dom: 20, change: '+4.3%', up: true  },
  { name: 'Collingwood',   clearance: 79, dom: 19, change: '+4.1%', up: true  },
  { name: 'South Yarra',   clearance: 78, dom: 18, change: '+3.9%', up: true  },
  { name: 'Northcote',     clearance: 76, dom: 21, change: '+3.6%', up: true  },
  { name: 'Fitzroy',       clearance: 74, dom: 22, change: '+3.2%', up: true  },
  { name: 'Abbotsford',    clearance: 71, dom: 23, change: '+3.0%', up: true  },
  { name: 'Richmond',      clearance: 72, dom: 24, change: '+2.8%', up: true  },
  { name: 'Prahran',       clearance: 73, dom: 25, change: '+2.1%', up: true  },
  { name: 'Brunswick',     clearance: 68, dom: 26, change: '+2.4%', up: true  },
  { name: 'Carlton',       clearance: 65, dom: 28, change: '+1.8%', up: true  },
]

// Clearance-based heat badge
function heatLabel(clearance) {
  if (clearance > 75) return 'Hot'
  if (clearance >= 60) return 'Warm'
  return 'Cool'
}

function heatStyle(label) {
  if (label === 'Hot')  return { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' }
  if (label === 'Warm') return { background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)'  }
  return                       { background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.25)' }
}

// Overall market signal from clearance + dom
function marketSignal(clearance, dom) {
  if (clearance > 75 && dom < 22) return 'Good time to sell'
  if (clearance >= 60 && dom < 28) return 'Monitor market'
  return 'Hold off'
}

function signalStyle(signal) {
  if (signal === 'Good time to sell') return { color: '#4ade80' }
  if (signal === 'Monitor market')    return { color: '#fb923c' }
  return                                     { color: '#94a3b8' }
}

// DOM trend vs inner-ring average (22 days)
const DOM_AVG = 22
function domTrend(dom) {
  if (dom < DOM_AVG - 2) return { icon: '↑', label: 'Fast', color: '#4ade80' }
  if (dom > DOM_AVG + 2) return { icon: '↓', label: 'Slow', color: '#f87171' }
  return                        { icon: '→', label: 'Avg',  color: '#94a3b8' }
}

const APPRAISAL_POINTS = [
  { icon: '◈', title: 'Suburb-level median',      desc: 'Current median price for houses and units in your suburb, updated weekly from public data.' },
  { icon: '◈', title: 'Comparable recent sales',  desc: '12-month rolling sales in your suburb — the data behind any credible appraisal conversation.' },
  { icon: '◈', title: 'Clearance rate context',   desc: 'Current clearance rate tells you how competitive your suburb is — a direct lever on your sale price.' },
  { icon: '◈', title: 'Days on market benchmark', desc: 'Know what a fast or slow sale looks like so you can set realistic campaign expectations.' },
]

const SEASONS = [
  { season: 'Autumn', months: 'Mar – May', rating: 'Peak',  note: 'Highest clearance rates historically' },
  { season: 'Spring', months: 'Sep – Nov', rating: 'Peak',  note: 'Largest buyer pool of the year' },
  { season: 'Summer', months: 'Dec – Feb', rating: 'Slow',  note: 'Reduced buyer competition' },
  { season: 'Winter', months: 'Jun – Aug', rating: 'Quiet', note: 'Fewer listings, fewer buyers' },
]

export default function SellersPage() {
  const [suburbs, setSuburbs] = useState(STATIC_SUBURBS)
  const [sortKey, setSortKey] = useState('clearance')

  useEffect(() => {
    fetch('/api/suburbs')
      .then(r => r.json())
      .then(data => { if (data.length > 0) setSuburbs(data) })
      .catch(() => {})
  }, [])

  const sorted = [...suburbs].sort((a, b) => {
    if (sortKey === 'clearance') return b.clearance - a.clearance
    if (sortKey === 'dom')       return a.dom - b.dom
    if (sortKey === 'change')    return parseFloat(b.change) - parseFloat(a.change)
    return 0
  })

  // Average clearance across loaded suburbs
  const avgClearance = suburbs.length
    ? Math.round(suburbs.reduce((s, r) => s + r.clearance, 0) / suburbs.length)
    : 74

  return (
    <>
      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">For sellers · Vendors</div>
        <h1 className="page-hero-headline">Is now the right<br /><em>time to sell?</em></h1>
        <p className="page-hero-sub">Market timing signals, suburb heat indicators and appraisal data — so you can make the most informed decision about when and how to list.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="#heat" className="btn-primary">See market heat by suburb</a>
          <a href="#timing" className="btn-ghost">Best time to sell</a>
        </div>
      </div>

      {/* HEAT TABLE */}
      <section className="suburb-strip" id="heat">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Market timing signals · {suburbs.length} suburbs tracked</div>
            <h2 className="section-title">Suburb heat by clearance rate.</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', maxWidth: '600px', marginBottom: '8px' }}>
          <span style={{ color: '#fbbf24' }}>Hot</span> = clearance above 75% &nbsp;·&nbsp;
          <span style={{ color: '#fb923c' }}>Warm</span> = 60–75% &nbsp;·&nbsp;
          <span style={{ color: '#94a3b8' }}>Cool</span> = below 60%.
          DOM trend vs inner-ring average of {DOM_AVG} days.
        </p>

        {/* SORT CONTROLS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
          {[['clearance', 'Clearance rate'], ['dom', 'Days on market'], ['change', 'Price change']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              style={{
                fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '6px 14px', border: '1px solid',
                borderColor: sortKey === key ? 'var(--gold)' : 'var(--navy-border)',
                color: sortKey === key ? 'var(--gold)' : 'var(--text-muted)',
                background: sortKey === key ? 'rgba(212,175,55,0.08)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--navy-border)' }}>
            <thead>
              <tr style={{ background: 'var(--navy-dark)' }}>
                {['Suburb', 'Clearance rate', 'Days on market', 'Qtr price change', 'Market signal'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '400', borderBottom: '1px solid var(--navy-border)', borderRight: '1px solid var(--navy-border)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const heat   = heatLabel(row.clearance)
                const trend  = domTrend(row.dom)
                const signal = marketSignal(row.clearance, row.dom)
                return (
                  <tr key={row.name} style={{ background: i % 2 === 0 ? 'var(--navy-mid)' : 'rgba(17,24,39,0.3)' }}>
                    <td style={{ padding: '16px 20px', borderRight: '1px solid var(--navy-border)', borderBottom: '1px solid var(--navy-border)' }}>
                      <Link
                        href="/residential"
                        style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: '300', color: 'var(--text-primary)', textDecoration: 'none' }}
                      >
                        {row.name}
                      </Link>
                    </td>
                    <td style={{ padding: '16px 20px', borderRight: '1px solid var(--navy-border)', borderBottom: '1px solid var(--navy-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: '300', color: 'var(--text-primary)' }}>
                          {row.clearance}%
                        </span>
                        <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', ...heatStyle(heat) }}>
                          {heat}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', borderRight: '1px solid var(--navy-border)', borderBottom: '1px solid var(--navy-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: '300', color: 'var(--text-primary)' }}>
                          {row.dom} days
                        </span>
                        <span style={{ fontSize: '11px', color: trend.color, fontWeight: '500' }} title={trend.label}>
                          {trend.icon}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', borderRight: '1px solid var(--navy-border)', borderBottom: '1px solid var(--navy-border)' }}>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: '300', color: row.up !== false ? '#4ade80' : '#f87171' }}>
                        {row.change || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--navy-border)' }}>
                      <span style={{ fontSize: '12px', letterSpacing: '0.04em', fontWeight: '500', ...signalStyle(signal) }}>
                        {signal}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
          Based on publicly available auction and listing data, updated weekly. Not financial advice.
        </p>
      </section>

      {/* SEASONAL TIMING GUIDE */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid var(--navy-border)', background: 'rgba(17,24,39,0.5)' }} id="timing">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <div className="section-eyebrow">Seasonal timing guide</div>
            <h2 className="section-title" style={{ marginBottom: '20px' }}>Autumn and spring<br />remain Melbourne&apos;s peaks.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
              Melbourne&apos;s inner ring historically sees the highest clearance rates and largest buyer pools in March–May (autumn) and September–November (spring). Listing outside these windows typically results in fewer bidders and weaker outcomes.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>
              Current inner ring average clearance:{' '}
              <span style={{ color: 'var(--gold-light)', fontFamily: 'Cormorant Garamond, serif', fontSize: '22px' }}>
                {avgClearance}%
              </span>{' '}
              — conditions {avgClearance > 72 ? 'favour sellers' : 'are mixed'} heading into the next quarter.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--navy-border)', border: '1px solid var(--navy-border)' }}>
            {SEASONS.map(s => (
              <div key={s.season} style={{ background: 'var(--navy-mid)', padding: '28px 24px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>{s.season}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '300', marginBottom: '6px' }}>{s.months}</div>
                <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', color: s.rating === 'Peak' ? '#4ade80' : 'var(--text-muted)' }}>
                  {s.rating}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPRAISAL CTA */}
      <section className="audience-section" id="appraisal">
        <div className="audience-intro">
          <div className="section-eyebrow">Appraisal data support</div>
          <h2 className="section-title">Know the numbers<br />before you meet your agent.</h2>
          <p>RECOMELB gives you the same data your agent will use in their appraisal — so you walk into that conversation informed, not blind.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--navy-border)', border: '1px solid var(--navy-border)', marginBottom: '40px' }}>
          {APPRAISAL_POINTS.map(p => (
            <div key={p.title} style={{ background: 'var(--navy-mid)', padding: '36px 32px' }}>
              <div style={{ color: 'var(--gold)', fontSize: '20px', marginBottom: '14px' }}>{p.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.02em' }}>{p.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: '300' }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '40px', border: '1px solid var(--gold)', background: 'rgba(212,175,55,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>
              Get your suburb&apos;s full data
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: '300', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.2' }}>
              See live median prices, clearance rates<br />and days on market — by suburb.
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '480px' }}>
              Our residential data table tracks every major inner-ring suburb. Click through to filter by type and compare the metrics that matter to vendors.
            </p>
          </div>
          <Link href="/residential" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            View suburb data →
          </Link>
        </div>
      </section>

      {/* SUBSCRIBE CTA */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid var(--navy-border)' }}>
        <div style={{ maxWidth: '560px' }}>
          <div className="section-eyebrow">Weekly seller briefing</div>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Get clearance rates<br />and heat signals weekly.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
            Know when your suburb hits peak selling conditions — delivered every Monday morning, free.
          </p>
          <a href="/#subscribe" className="btn-primary">Subscribe for free</a>
        </div>
      </section>
    </>
  )
}
