'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const STATIC_SUBURBS = [
  { name: 'Fitzroy',       median: '$1.48M', clearance: '74%', dom: '22 days', yield: '3.8%', change: '+3.2%', _c:74, _d:22, _y:3.8, _g:3.2, _m:1.48 },
  { name: 'Collingwood',   median: '$1.39M', clearance: '79%', dom: '19 days', yield: '3.6%', change: '+4.1%', _c:79, _d:19, _y:3.6, _g:4.1, _m:1.39 },
  { name: 'Richmond',      median: '$1.52M', clearance: '72%', dom: '24 days', yield: '3.5%', change: '+2.8%', _c:72, _d:24, _y:3.5, _g:2.8, _m:1.52 },
  { name: 'Northcote',     median: '$1.34M', clearance: '76%', dom: '21 days', yield: '3.9%', change: '+3.6%', _c:76, _d:21, _y:3.9, _g:3.6, _m:1.34 },
  { name: 'Brunswick',     median: '$1.12M', clearance: '68%', dom: '26 days', yield: '4.1%', change: '+2.4%', _c:68, _d:26, _y:4.1, _g:2.4, _m:1.12 },
  { name: 'Abbotsford',    median: '$1.28M', clearance: '71%', dom: '23 days', yield: '3.7%', change: '+3.0%', _c:71, _d:23, _y:3.7, _g:3.0, _m:1.28 },
  { name: 'Prahran',       median: '$1.35M', clearance: '73%', dom: '25 days', yield: '3.6%', change: '+2.1%', _c:73, _d:25, _y:3.6, _g:2.1, _m:1.35 },
  { name: 'Fitzroy North', median: '$1.56M', clearance: '77%', dom: '20 days', yield: '3.4%', change: '+4.3%', _c:77, _d:20, _y:3.4, _g:4.3, _m:1.56 },
  { name: 'Carlton',       median: '$1.08M', clearance: '65%', dom: '28 days', yield: '4.3%', change: '+1.8%', _c:65, _d:28, _y:4.3, _g:1.8, _m:1.08 },
  { name: 'South Yarra',   median: '$1.68M', clearance: '78%', dom: '18 days', yield: '3.2%', change: '+3.9%', _c:78, _d:18, _y:3.2, _g:3.9, _m:1.68 },
]


// Normalise API shape → comparison shape
function normalise(s) {
  const c = typeof s.clearance === 'number' ? s.clearance : parseFloat(s.clearance)
  const d = typeof s.dom       === 'number' ? s.dom       : parseFloat(s.dom)
  const y = parseFloat(s.yield  || s.rental_yield || 0)
  const g = parseFloat(s.change || s.growth || 0)
  const m = parseFloat((s.median || '').replace(/[$M]/g, '')) || 0
  return {
    name:      s.name,
    median:    s.median,
    clearance: isNaN(c) ? s.clearance : c + '%',
    dom:       isNaN(d) ? s.dom       : d + ' days',
    yield:     s.yield || s.rental_yield || '',
    change:    s.change || s.growth || '',
    _c: c, _d: d, _y: y, _g: g, _m: m,
  }
}

// Per-metric: which index wins? Returns array index of best, or -1 if tied/empty
const METRICS = [
  { label: 'Median price',      key: 'median',    raw: '_m', best: 'low'  },
  { label: 'Clearance rate',    key: 'clearance', raw: '_c', best: 'high' },
  { label: 'Days on market',    key: 'dom',       raw: '_d', best: 'low'  },
  { label: 'Rental yield',      key: 'yield',     raw: '_y', best: 'high' },
  { label: 'Quarterly change',  key: 'change',    raw: '_g', best: 'high' },
]

function bestIndex(compared, rawKey, direction) {
  const vals = compared.map(s => s ? s[rawKey] : null)
  const valid = vals.filter(v => v !== null && !isNaN(v))
  if (valid.length < 2) return -1
  const target = direction === 'high' ? Math.max(...valid) : Math.min(...valid)
  const idx = vals.indexOf(target)
  // only highlight if uniquely best
  return vals.filter(v => v === target).length === 1 ? idx : -1
}

export default function BuyersPage() {
  const [suburbs, setSuburbs]         = useState(STATIC_SUBURBS.map(normalise))
  const [selected, setSelected]       = useState(['Fitzroy', 'Collingwood', ''])
  const [watchlistEmail, setWatchlistEmail]   = useState('')
  const [watchlistSuburb, setWatchlistSuburb] = useState('')
  const [watchlistStatus, setWatchlistStatus] = useState('idle')
  const [watchlistError, setWatchlistError]   = useState('')
  const [undervalued, setUndervalued]         = useState([])
  const [undervaluedLoaded, setUndervaluedLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/suburbs')
      .then(r => r.json())
      .then(data => { if (data.length > 0) setSuburbs(data.map(normalise)) })
      .catch(() => {})

    try {
      const supabase = createClient()
      if (supabase) {
        supabase.from('undervalued_listings').select('*').order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data && data.length > 0) setUndervalued(data)
            setUndervaluedLoaded(true)
          })
          .catch(() => setUndervaluedLoaded(true))
      } else {
        setUndervaluedLoaded(true)
      }
    } catch {
      setUndervaluedLoaded(true)
    }
  }, [])

  async function handleWatchlist() {
    if (!watchlistEmail) return
    setWatchlistStatus('loading')
    try {
      const res  = await fetch('/api/watchlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: watchlistEmail, suburb: watchlistSuburb }),
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
  const compared  = selected.map(name => suburbs.find(s => s.name === name) || null)
  const activeCount = compared.filter(Boolean).length

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
            <div className="section-eyebrow">Suburb comparison tool · {suburbs.length} suburbs</div>
            <h2 className="section-title">Compare up to 3 suburbs.</h2>
          </div>
        </div>
        <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', maxWidth:'560px', marginBottom:'32px'}}>
          Select up to three suburbs to compare key market metrics side by side. <span style={{color:'var(--gold)'}}>Gold</span> highlights the strongest value for each metric.
        </p>

        {/* SELECTORS */}
        <div className="comparison-selectors" style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'40px'}}>
          {[0,1,2].map(i => (
            <div key={i}>
              <div style={{fontSize:'10px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px'}}>
                Suburb {i + 1}{i === 0 ? ' (required)' : ' (optional)'}
              </div>
              <select
                className="select-input"
                style={{width:'100%'}}
                value={selected[i]}
                onChange={e => setSuburb(i, e.target.value)}
              >
                <option value="">— Select suburb —</option>
                {suburbs.map(s => (
                  <option
                    key={s.name}
                    value={s.name}
                    disabled={selected.some((sel, idx) => idx !== i && sel === s.name)}
                  >
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* COMPARISON TABLE */}
        {activeCount > 0 ? (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', border:'1px solid var(--navy-border)'}}>
              <thead>
                <tr style={{background:'var(--navy-dark)'}}>
                  <th style={{padding:'16px 20px', textAlign:'left', fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-muted)', fontWeight:'400', width:'200px', borderBottom:'1px solid var(--navy-border)', borderRight:'1px solid var(--navy-border)'}}>
                    Metric
                  </th>
                  {compared.map((s, i) => (
                    <th key={i} style={{padding:'16px 24px', textAlign:'left', borderBottom:'1px solid var(--navy-border)', borderRight:'1px solid var(--navy-border)', minWidth:'160px'}}>
                      {s ? (
                        <>
                          <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:'300', color:'var(--text-primary)', lineHeight:'1.1'}}>{s.name}</div>
                          <div style={{fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginTop:'4px'}}>{s._m ? `$${s._m.toFixed(2)}M median` : ''}</div>
                        </>
                      ) : (
                        <div style={{fontSize:'13px', color:'var(--text-muted)', fontStyle:'italic'}}>Not selected</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric, mi) => {
                  const winIdx = bestIndex(compared, metric.raw, metric.best)
                  return (
                    <tr key={metric.key} style={{background: mi % 2 === 0 ? 'var(--navy-mid)' : 'rgba(17,24,39,0.3)'}}>
                      <td style={{padding:'18px 20px', fontSize:'12px', color:'var(--text-muted)', letterSpacing:'0.04em', borderRight:'1px solid var(--navy-border)', borderBottom:'1px solid var(--navy-border)', whiteSpace:'nowrap'}}>
                        {metric.label}
                      </td>
                      {compared.map((s, ci) => {
                        const isWinner = winIdx === ci
                        return (
                          <td key={ci} style={{padding:'18px 24px', borderRight:'1px solid var(--navy-border)', borderBottom:'1px solid var(--navy-border)'}}>
                            {s ? (
                              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                <span style={{
                                  fontFamily:'Cormorant Garamond, serif',
                                  fontSize:'22px',
                                  fontWeight:'300',
                                  color: isWinner ? 'var(--gold-light)' : 'var(--text-primary)',
                                  transition:'color 0.2s',
                                }}>
                                  {s[metric.key] || '—'}
                                </span>
                                {isWinner && (
                                  <span style={{fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)', border:'1px solid var(--gold)', padding:'2px 6px', opacity:0.8}}>
                                    best
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span style={{color:'var(--navy-border)', fontSize:'18px'}}>—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p style={{marginTop:'12px', fontSize:'11px', color:'var(--text-muted)'}}>
              Based on publicly available data updated weekly. Best value highlighted per metric. Not financial advice.
            </p>
          </div>
        ) : (
          <div style={{padding:'48px', border:'1px solid var(--navy-border)', color:'var(--text-muted)', fontSize:'14px', textAlign:'center'}}>
            Select at least one suburb above to see comparison data.
          </div>
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
              ['Est. gross rental yield','4.8%',      true ],
              ['12-month suburb growth', '+3.2%',     true ],
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
        {undervaluedLoaded && undervalued.length === 0 ? (
          <div style={{padding:'60px 48px', border:'1px solid var(--navy-border)', color:'var(--text-muted)', fontSize:'14px', textAlign:'center', letterSpacing:'0.04em'}}>
            Checking for deals this week — check back Monday.
          </div>
        ) : (
          <div className="undervalued-grid">
            {undervalued.map(p => (
              <div className="undervalued-card" key={p.address || p.id}>
                <span className="deal-badge" style={{marginBottom:'20px', display:'inline-block'}}>{p.tag}</span>
                <div className="suburb-price">{p.price}</div>
                <div className="suburb-type" style={{marginTop:'6px', marginBottom:'20px'}}>{p.address}</div>
                <div style={{display:'inline-block', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', color:'#4ade80', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 10px', marginBottom:'20px'}}>{p.vs_median}</div>
                <div className="suburb-meta">
                  <div className="suburb-meta-item">Yield<span>{p.yield}</span></div>
                  <div className="suburb-meta-item">DOM<span>{p.dom}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="deal-disclaimer" style={{marginTop:'16px'}}>Properties flagged based on publicly available listing data. Not financial advice.</p>
      </section>

      {/* WATCHLIST SIGNUP */}
      <section className="section-padded" style={{padding:'80px 48px', borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div className="two-col-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center'}}>
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
                <select className="select-input" style={{width:'100%'}} value={watchlistSuburb} onChange={e => setWatchlistSuburb(e.target.value)}>
                  <option value="">— Select suburb to watch (optional) —</option>
                  {suburbs.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
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
