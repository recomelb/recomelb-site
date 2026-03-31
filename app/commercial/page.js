'use client'
import { useState, useEffect } from 'react'

const LISTING_LINKS = [
  { name: 'CBD Core',       href: 'https://www.domain.com.au/commercial/for-lease/?suburb=melbourne-vic-3000' },
  { name: 'Fitzroy',        href: 'https://www.domain.com.au/commercial/for-lease/?suburb=fitzroy-vic-3065' },
  { name: 'Port Melbourne', href: 'https://www.domain.com.au/commercial/for-lease/?suburb=port-melbourne-vic-3207' },
  { name: 'Collingwood',    href: 'https://www.domain.com.au/commercial/for-lease/?suburb=collingwood-vic-3066' },
  { name: 'Richmond',       href: 'https://www.domain.com.au/commercial/for-lease/?suburb=richmond-vic-3121' },
  { name: 'South Melbourne',href: 'https://www.domain.com.au/commercial/for-lease/?suburb=south-melbourne-vic-3205' },
]

const STATIC_PRECINCTS = [
  { name: 'CBD Core',       sub: 'Collins St precinct',    type: 'Office',    yield: '6.8%', vacancy: '11.2%', rent: '$680/m²', change: '+0.4%', up: true,  bar: 68 },
  { name: 'Fitzroy',        sub: 'Brunswick St strip',     type: 'Retail',    yield: '5.4%', vacancy: '7.8%',  rent: '$420/m²', change: '+0.6%', up: true,  bar: 54 },
  { name: 'Port Melbourne', sub: 'Inner west logistics',   type: 'Industrial',yield: '5.9%', vacancy: '3.1%',  rent: '$195/m²', change: '+1.2%', up: true,  bar: 59 },
  { name: 'Collingwood',    sub: 'Smith St precinct',      type: 'Mixed',     yield: '5.1%', vacancy: '9.4%',  rent: '$380/m²', change: '-0.2%', up: false, bar: 51 },
  { name: 'Richmond',       sub: 'Swan St strip',          type: 'Office',    yield: '6.2%', vacancy: '10.8%', rent: '$520/m²', change: '+0.3%', up: true,  bar: 62 },
  { name: 'South Melbourne',sub: 'City fringe precinct',   type: 'Retail',    yield: '5.6%', vacancy: '6.9%',  rent: '$440/m²', change: '+0.5%', up: true,  bar: 56 },
]

const TYPES = ['All', 'Office', 'Retail', 'Industrial', 'Mixed']

export default function CommercialPage() {
  const [filter, setFilter] = useState('All')
  const [precincts, setPrecincts] = useState(STATIC_PRECINCTS)
  const [sheetLoaded, setSheetLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/commercial')
      .then(r => r.json())
      .then(data => { setSheetLoaded(true); if (data.length > 0) setPrecincts(data) })
      .catch(() => setSheetLoaded(true))
  }, [])

  const visible = filter === 'All' ? precincts : precincts.filter(p => p.type === filter)

  return (
    <>
      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">Commercial · Inner Melbourne · Q1 2025</div>
        <h1 className="page-hero-headline">Melbourne commercial<br /><em>market intelligence.</em></h1>
        <p className="page-hero-sub">Net yields, vacancy rates and rent per m² across Melbourne&apos;s key commercial precincts. Office, retail, industrial and mixed-use. Updated weekly.</p>
      </div>

      {/* PRECINCTS */}
      <section className="suburb-strip">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Inner Melbourne · {visible.length} precincts</div>
            <h2 className="section-title">Precinct market data</h2>
          </div>
        </div>

        <div className="filter-tabs" style={{marginBottom:'32px'}}>
          {TYPES.map(t => (
            <button key={t} className={`filter-tab${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        <div className="commercial-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(min(280px,100%),1fr))'}}>
          {sheetLoaded && precincts.length === 0 && (
            <div style={{padding:'60px', color:'var(--text-muted)', gridColumn:'1/-1', textAlign:'center'}}>Commercial data coming soon.</div>
          )}
          {visible.map(p => (
            <div className="commercial-card" key={p.name}>
              <span className="commercial-type-badge">{p.type}</span>
              <div className="commercial-name">{p.name}</div>
              <div className="commercial-sub">{p.sub}</div>
              <div className="commercial-yield">{p.yield}</div>
              <div className="commercial-yield-label">Net yield</div>
              <div className={`suburb-change ${p.up ? 'up' : 'down'}`}>{p.up ? '↑' : '↓'} {p.change} this quarter</div>
              <div className="commercial-meta">
                <div className="commercial-meta-item">Vacancy<span>{p.vacancy}</span></div>
                <div className="commercial-meta-item">Avg rent<span>{p.rent}</span></div>
              </div>
              <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:`${p.bar}%`}}></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{padding:'60px 48px', borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div className="section-eyebrow" style={{marginBottom:'32px'}}>Market summary · Q1 2025</div>
        <div className="stats-strip-grid" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'var(--navy-border)', border:'1px solid var(--navy-border)'}}>
          {[
            { num: '6.8%', label: 'Avg net yield · CBD office' },
            { num: '3.1%', label: 'Vacancy · Industrial (lowest)' },
            { num: '$680/m²', label: 'Top rent · Collins St office' },
            { num: '+1.2%', label: 'Best yield growth · Port Melb' },
          ].map(s => (
            <div key={s.label} className="mini-stat">
              <div className="mini-stat-num">{s.num}</div>
              <div className="mini-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTIVE LISTINGS */}
      <section className="suburb-strip" style={{borderTop:'1px solid var(--navy-border)'}}>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Browse active listings · Via Domain</div>
            <h2 className="section-title">Current listings by precinct.</h2>
          </div>
        </div>
        <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', maxWidth:'520px', marginBottom:'32px'}}>
          Browse live commercial listings on Domain for each inner-Melbourne precinct. Opens in a new tab.
        </p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(200px,100%), 1fr))', gap:'1px', background:'var(--navy-border)', border:'1px solid var(--navy-border)'}}>
          {LISTING_LINKS.map(({ name, href }) => (
            <div key={name} style={{background:'var(--navy-mid)', padding:'28px 24px', display:'flex', flexDirection:'column', gap:'16px'}}>
              <div>
                <div style={{fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'8px'}}>Commercial</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:'300', color:'var(--text-primary)'}}>{name}</div>
              </div>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold)', border:'1px solid var(--gold)', padding:'8px 16px', textDecoration:'none', textAlign:'center', transition:'all 0.2s', background:'transparent', display:'block'}}
              >
                View listings →
              </a>
            </div>
          ))}
        </div>
        <p style={{marginTop:'16px', fontSize:'11px', color:'var(--text-muted)'}}>Listings sourced from Domain. Opens in a new tab.</p>
      </section>

      {/* CTA */}
      <section style={{padding:'60px 48px', borderTop:'1px solid var(--navy-border)'}}>
        <div style={{maxWidth:'560px'}}>
          <div className="section-eyebrow">Commercial intelligence digest</div>
          <h2 className="section-title" style={{marginBottom:'16px'}}>Stay ahead of<br />the commercial market.</h2>
          <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', marginBottom:'28px'}}>Office vacancy, industrial yields and retail leasing activity — delivered every Monday with the residential data.</p>
          <a href="/#subscribe" className="btn-primary">Subscribe for free</a>
        </div>
      </section>
    </>
  )
}
