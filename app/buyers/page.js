'use client'
import { useState } from 'react'

const SUBURBS = [
  { name: 'Fitzroy',       median: '$1.48M', clearance: '74%', dom: '22 days', yield: '3.8%', growth: '+3.2%' },
  { name: 'Collingwood',   median: '$1.39M', clearance: '79%', dom: '19 days', yield: '3.6%', growth: '+4.1%' },
  { name: 'Richmond',      median: '$1.52M', clearance: '72%', dom: '24 days', yield: '3.5%', growth: '+2.8%' },
  { name: 'Northcote',     median: '$1.34M', clearance: '76%', dom: '21 days', yield: '3.9%', growth: '+3.6%' },
  { name: 'Brunswick',     median: '$1.12M', clearance: '68%', dom: '26 days', yield: '4.1%', growth: '+2.4%' },
  { name: 'Abbotsford',    median: '$1.28M', clearance: '71%', dom: '23 days', yield: '3.7%', growth: '+3.0%' },
  { name: 'Prahran',       median: '$1.35M', clearance: '73%', dom: '25 days', yield: '3.6%', growth: '+2.1%' },
  { name: 'Fitzroy North', median: '$1.56M', clearance: '77%', dom: '20 days', yield: '3.4%', growth: '+4.3%' },
  { name: 'Carlton',       median: '$1.08M', clearance: '65%', dom: '28 days', yield: '4.3%', growth: '+1.8%' },
  { name: 'South Yarra',   median: '$1.68M', clearance: '78%', dom: '18 days', yield: '3.2%', growth: '+3.9%' },
]

const UNDERVALUED = [
  { address: '2-bed townhouse, Fitzroy North', price: '$580,000', vsMedian: '6.4% below unit median', yield: '4.8%', dom: '18 days', tag: 'Best pick' },
  { address: '1-bed apartment, Collingwood',   price: '$448,000', vsMedian: '4.1% below unit median', yield: '5.1%', dom: '12 days', tag: 'High yield' },
  { address: '3-bed terrace, Brunswick',       price: '$920,000', vsMedian: '5.8% below house median', yield: '4.2%', dom: '21 days', tag: 'Value buy' },
]

const ROWS = ['Median price', 'Clearance rate', 'Days on market', 'Rental yield', '12-month growth']
const KEYS = ['median', 'clearance', 'dom', 'yield', 'growth']

export default function BuyersPage() {
  const [selected, setSelected] = useState(['Fitzroy', 'Collingwood', ''])
  const [watchlistEmail, setWatchlistEmail] = useState('')
  const [watchlistStatus, setWatchlistStatus] = useState('idle') // idle | loading | success | error
  const [watchlistError, setWatchlistError]   = useState('')

  async function handleWatchlist() {
    if (!watchlistEmail) return
    setWatchlistStatus('loading')
    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: watchlistEmail }),
      })
      const data = await res.json()
      if (data.success) { setWatchlistStatus('success') }
      else { setWatchlistError(data.error || 'Something went wrong, please try again.'); setWatchlistStatus('error') }
    } catch {
      setWatchlistError('Something went wrong, please try again.')
      setWatchlistStatus('error')
    }
  }

  const setSuburb = (i, val) => setSelected(prev => prev.map((s, idx) => idx === i ? val : s))

  const compared = selected.map(name => SUBURBS.find(s => s.name === name) || null)

  return (
    <>
      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">For buyers · Property seekers</div>
        <h1 className="page-hero-headline">Find the opportunity<br /><em>before everyone else.</em></h1>
        <p className="page-hero-sub">Compare suburbs side by side, track undervalued properties and get weekly alerts on the deals worth investigating — before the rest of the market catches on.</p>
        <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
          <a href="#compare" className="btn-primary">Compare suburbs</a>
          <a href="#undervalued" className="btn-ghost">See undervalued properties</a>
        </div>
      </div>

      {/* SUBURB COMPARISON */}
      <section className="suburb-strip" id="compare">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Suburb comparison tool</div>
            <h2 className="section-title">Compare up to 3 suburbs.</h2>
          </div>
        </div>

        <div className="comparison-selectors">
          {[0,1,2].map(i => (
            <div className="comparison-selector" key={i}>
              <label>Suburb {i + 1}</label>
              <select
                className="select-input"
                value={selected[i]}
                onChange={e => setSuburb(i, e.target.value)}
              >
                <option value="">— Select suburb —</option>
                {SUBURBS.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {compared.some(Boolean) && (
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                {compared.map((s, i) => <th key={i}>{s ? s.name : '—'}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row}>
                  <td>{row}</td>
                  {compared.map((s, i) => (
                    <td key={i}><span className="val">{s ? s[KEYS[ri]] : '—'}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* DEAL OF THE WEEK */}
      <section className="deal-section">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Deal of the week · Manually curated</div>
            <h2 className="section-title">This week&apos;s smartest buy.</h2>
          </div>
        </div>
        <div className="deal-card">
          <div className="deal-card-main">
            <div className="deal-price">$580,000</div>
            <div className="deal-address">2-bed townhouse · Fitzroy North</div>
            <div className="deal-badge">6.4% below unit median</div>
            <div className="deal-why">Priced below the suburb unit median in one of Melbourne&apos;s most tightly held inner-north suburbs. Strong rental demand from professionals and students. Limited comparable stock under $600k.</div>
            <a href="/#subscribe" className="btn-primary">View full analysis →</a>
          </div>
          <div className="deal-card-stats">
            {[
              ['Suburb median (house)', '$1,480,000', false],
              ['Suburb median (unit)',  '$620,000',   false],
              ['Est. gross rental yield','4.8%',      true],
              ['12-month suburb growth', '+3.2%',     true],
              ['Days on market',        '18 days',    false],
            ].map(([label, val, hl]) => (
              <div className="deal-stat-row" key={label}>
                <span className="deal-stat-label">{label}</span>
                <span className={`deal-stat-value${hl ? ' highlight' : ''}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="deal-disclaimer">New deal analysed every Monday. Based on publicly available data — not financial advice.</p>
      </section>

      {/* UNDERVALUED PROPERTIES */}
      <section className="suburb-strip" id="undervalued">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Undervalued properties · This week</div>
            <h2 className="section-title">Below-median properties flagged this week.</h2>
          </div>
        </div>
        <div className="undervalued-grid">
          {UNDERVALUED.map(p => (
            <div className="undervalued-card" key={p.address}>
              <span className="deal-badge" style={{marginBottom:'20px', display:'inline-block'}}>{p.tag}</span>
              <div className="suburb-price">{p.price}</div>
              <div className="suburb-type" style={{marginTop:'6px', marginBottom:'20px'}}>{p.address}</div>
              <div style={{display:'inline-block', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', color:'#4ade80', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 10px', marginBottom:'20px'}}>{p.vsMedian}</div>
              <div className="suburb-meta">
                <div className="suburb-meta-item">Yield<span>{p.yield}</span></div>
                <div className="suburb-meta-item">DOM<span>{p.dom}</span></div>
              </div>
            </div>
          ))}
        </div>
        <p className="deal-disclaimer" style={{marginTop:'16px'}}>Properties flagged based on publicly available listing data. Not financial advice.</p>
      </section>

      {/* WATCHLIST SIGNUP */}
      <section style={{padding:'80px 48px', borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center'}}>
          <div>
            <div className="section-eyebrow">Suburb watchlist</div>
            <h2 className="section-title" style={{marginBottom:'16px'}}>Get alerts when<br />your suburb moves.</h2>
            <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7'}}>Enter your email and we&apos;ll notify you when median prices shift or clearance rates move significantly in the suburbs you care about.</p>
          </div>
          <div>
            {watchlistStatus === 'success' ? (
              <div style={{color:'#4ade80', fontSize:'14px', padding:'20px', border:'1px solid rgba(74,222,128,0.3)', background:'rgba(74,222,128,0.05)'}}>You&apos;re in! First digest arrives Monday.</div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                <input className="email-input" type="email" placeholder="Your email address" value={watchlistEmail} onChange={e => setWatchlistEmail(e.target.value)} />
                <button className="btn-primary" style={{padding:'16px'}} onClick={handleWatchlist} disabled={watchlistStatus === 'loading'}>
                  {watchlistStatus === 'loading' ? 'Subscribing…' : 'Add me to the watchlist'}
                </button>
                {watchlistStatus === 'error' && <div style={{color:'#f87171', fontSize:'13px'}}>{watchlistError}</div>}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
