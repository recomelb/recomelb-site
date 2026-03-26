'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const STATIC_SUBURBS = [
  { name: 'Fitzroy North', clearance: 77, dom: 20, change: '+4.3%', up: true },
  { name: 'Collingwood',   clearance: 79, dom: 19, change: '+4.1%', up: true },
  { name: 'South Yarra',   clearance: 78, dom: 18, change: '+3.9%', up: true },
  { name: 'Northcote',     clearance: 76, dom: 21, change: '+3.6%', up: true },
  { name: 'Fitzroy',       clearance: 74, dom: 22, change: '+3.2%', up: true },
  { name: 'Abbotsford',    clearance: 71, dom: 23, change: '+3.0%', up: true },
  { name: 'Richmond',      clearance: 72, dom: 24, change: '+2.8%', up: true },
  { name: 'Prahran',       clearance: 73, dom: 25, change: '+2.1%', up: true },
  { name: 'Brunswick',     clearance: 68, dom: 26, change: '+2.4%', up: true },
  { name: 'Carlton',       clearance: 65, dom: 28, change: '+1.8%', up: true },
]

function heatLabel(c) {
  if (c > 75)  return 'Hot'
  if (c >= 60) return 'Warm'
  return 'Cool'
}

function heatClass(label) {
  if (label === 'Hot')  return 'heat-badge heat-hot'
  if (label === 'Warm') return 'heat-badge heat-warm'
  return 'heat-badge heat-neutral'
}

// DOM trend vs inner-ring average
const DOM_AVG = 22
function domTrend(dom) {
  if (dom < DOM_AVG - 2) return { icon: '↑', color: '#4ade80', title: 'Fast' }
  if (dom > DOM_AVG + 2) return { icon: '↓', color: '#f87171', title: 'Slow' }
  return                        { icon: '→', color: '#94a3b8', title: 'Average' }
}

function marketSignal(clearance, dom) {
  if (clearance > 75 && dom < 22) return { label: 'Good time to sell', color: '#4ade80' }
  if (clearance >= 60 && dom < 28) return { label: 'Monitor market',    color: '#fb923c' }
  return                                   { label: 'Hold off',          color: '#94a3b8' }
}

const SEASONS = [
  { season: 'Autumn', months: 'Mar – May', rating: 'Peak',  note: 'Highest clearance rates historically' },
  { season: 'Spring', months: 'Sep – Nov', rating: 'Peak',  note: 'Largest buyer pool of the year' },
  { season: 'Summer', months: 'Dec – Feb', rating: 'Slow',  note: 'Reduced buyer competition' },
  { season: 'Winter', months: 'Jun – Aug', rating: 'Quiet', note: 'Fewer listings, fewer buyers' },
]

const APPRAISAL_POINTS = [
  { icon: '◈', title: 'Suburb-level median',      desc: 'Current median price for houses and units in your suburb, updated weekly from public data.' },
  { icon: '◈', title: 'Comparable recent sales',  desc: '12-month rolling sales in your suburb — the data behind any credible appraisal conversation.' },
  { icon: '◈', title: 'Clearance rate context',   desc: 'Current clearance rate tells you how competitive your suburb is — a direct lever on your sale price.' },
  { icon: '◈', title: 'Days on market benchmark', desc: 'Know what a fast or slow sale looks like so you can set realistic campaign expectations.' },
]

export default function SellersPage() {
  const [suburbs, setSuburbs] = useState(STATIC_SUBURBS)
  const [sortKey, setSortKey]  = useState('clearance')
  const [source, setSource]    = useState('static')

  useEffect(() => {
    fetch('/api/suburbs')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSuburbs(data)
          setSource('live')
        }
      })
      .catch(() => {})
  }, [])

  const sorted = [...suburbs].sort((a, b) => {
    if (sortKey === 'clearance') return (b.clearance || 0) - (a.clearance || 0)
    if (sortKey === 'dom')       return (a.dom || 0) - (b.dom || 0)
    if (sortKey === 'change') {
      const av = parseFloat(a.change) || 0
      const bv = parseFloat(b.change) || 0
      return bv - av
    }
    return 0
  })

  const avgClearance = suburbs.length
    ? Math.round(suburbs.reduce((sum, r) => sum + (r.clearance || 0), 0) / suburbs.length)
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
            <div className="section-eyebrow">
              Market timing signals · {suburbs.length} suburbs · {source === 'live' ? 'Live data' : 'Sample data'}
            </div>
            <h2 className="section-title">Suburb heat by clearance rate.</h2>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', maxWidth: '600px', marginBottom: '8px' }}>
          <span style={{ color: '#4ade80' }}>Hot</span> = clearance above 75% &nbsp;·&nbsp;
          <span style={{ color: '#facc15' }}>Warm</span> = 60–75% &nbsp;·&nbsp;
          <span style={{ color: '#94a3b8' }}>Cool</span> = below 60%.
          &nbsp;DOM trend vs {DOM_AVG}-day inner-ring average.
        </p>

        {/* SORT CONTROLS */}
        <div style={{ display: 'flex', gap: '8px', margin: '20px 0 8px', flexWrap: 'wrap' }}>
          {[['clearance', 'Clearance rate'], ['dom', 'Days on market'], ['change', 'Price change']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              style={{
                fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '6px 14px', border: '1px solid', cursor: 'pointer',
                borderColor: sortKey === key ? 'var(--gold)' : 'var(--navy-border)',
                color:       sortKey === key ? 'var(--gold)' : 'var(--text-muted)',
                background:  sortKey === key ? 'rgba(212,175,55,0.08)' : 'transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="table-scroll">
        <table className="heat-table">
          <thead>
            <tr>
              <th>Suburb</th>
              <th>Clearance rate</th>
              <th>Days on market</th>
              <th>Qtr price change</th>
              <th>Market signal</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => {
              const heat   = heatLabel(row.clearance || 0)
              const trend  = domTrend(row.dom || 0)
              const signal = marketSignal(row.clearance || 0, row.dom || 0)
              const changeVal = row.change || '—'
              const isUp = row.up !== false && changeVal !== '—'
              return (
                <tr key={row.name}>
                  <td className="suburb-col">
                    <Link href="/residential" style={{ color: 'inherit', textDecoration: 'none' }}>
                      {row.name}
                    </Link>
                  </td>
                  <td className="num-col">
                    <span style={{ marginRight: '10px' }}>{row.clearance || 0}%</span>
                    <span className={heatClass(heat)}>{heat}</span>
                  </td>
                  <td className="num-col">
                    <span style={{ marginRight: '8px' }}>{row.dom || 0} days</span>
                    <span style={{ color: trend.color, fontSize: '13px' }} title={trend.title}>{trend.icon}</span>
                  </td>
                  <td className="num-col" style={{ color: isUp ? '#4ade80' : '#f87171' }}>
                    {changeVal}
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '0.03em', color: signal.color }}>
                      {signal.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
        <p style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
          Based on publicly available auction and listing data, updated weekly. Not financial advice.
        </p>
      </section>

      {/* SEASONAL TIMING GUIDE */}
      <section className="section-padded" style={{ padding: '80px 48px', borderTop: '1px solid var(--navy-border)', background: 'rgba(17,24,39,0.5)' }} id="timing">
        <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <div className="section-eyebrow">Seasonal timing guide</div>
            <h2 className="section-title" style={{ marginBottom: '20px' }}>
              Autumn and spring<br />remain Melbourne&apos;s peaks.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
              Melbourne&apos;s inner ring historically sees the highest clearance rates and largest buyer pools in March–May (autumn) and September–November (spring). Listing outside these windows typically results in fewer bidders and weaker outcomes.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>
              Current inner ring average clearance:{' '}
              <span style={{ color: 'var(--gold-light)', fontFamily: 'Cormorant Garamond, serif', fontSize: '22px' }}>
                {avgClearance}%
              </span>
              {' '}— conditions {avgClearance > 72 ? 'favour sellers' : 'are mixed'} heading into the next quarter.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--navy-border)', border: '1px solid var(--navy-border)' }}>
            {SEASONS.map(s => (
              <div key={s.season} style={{ background: 'var(--navy-mid)', padding: '28px 24px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
                  {s.season}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '300', marginBottom: '6px' }}>
                  {s.months}
                </div>
                <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', color: s.rating === 'Peak' ? '#4ade80' : 'var(--text-muted)' }}>
                  {s.rating}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {s.note}
                </div>
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
        <div className="four-tile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--navy-border)', border: '1px solid var(--navy-border)', marginBottom: '40px' }}>
          {APPRAISAL_POINTS.map(p => (
            <div key={p.title} style={{ background: 'var(--navy-mid)', padding: '36px 32px' }}>
              <div style={{ color: 'var(--gold)', fontSize: '20px', marginBottom: '14px' }}>{p.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.02em' }}>{p.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: '300' }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* GET YOUR SUBURB'S FULL DATA CARD */}
        <div style={{ padding: '40px', border: '1px solid var(--gold)', background: 'rgba(212,175,55,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>
              Get your suburb&apos;s full data
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: '300', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: '1.2' }}>
              See live median prices, clearance rates<br />and days on market — by suburb.
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '480px' }}>
              Our residential data table tracks every major inner-ring suburb. Filter by property type and compare the metrics that matter to vendors.
            </p>
          </div>
          <Link href="/residential" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            View suburb data →
          </Link>
        </div>
      </section>

      {/* SUBSCRIBE CTA */}
      <section className="section-padded" style={{ padding: '80px 48px', borderTop: '1px solid var(--navy-border)' }}>
        <div style={{ maxWidth: '560px' }}>
          <div className="section-eyebrow">Weekly seller briefing</div>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            Get clearance rates<br />and heat signals weekly.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
            Know when your suburb hits peak selling conditions — delivered every Monday morning, free.
          </p>
          <a href="/#subscribe" className="btn-primary">Subscribe for free</a>
        </div>
      </section>
    </>
  )
}
