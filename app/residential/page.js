'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import SuburbChart from '@/components/SuburbChart'

const STATIC_SUBURBS = [
  { name: 'Fitzroy',       type: 'House', location: 'Inner North', tag: 'High demand',  median: '$1.48M', clearance: 74, dom: 22, change: '+3.2%', up: true,  trend: [1.28,1.30,1.33,1.35,1.38,1.40,1.41,1.43,1.44,1.46,1.47,1.48] },
  { name: 'Collingwood',   type: 'House', location: 'Inner North', tag: 'Rising fast',  median: '$1.39M', clearance: 79, dom: 19, change: '+4.1%', up: true,  trend: [1.18,1.20,1.23,1.25,1.28,1.30,1.32,1.34,1.36,1.37,1.38,1.39] },
  { name: 'Richmond',      type: 'House', location: 'Inner East',  tag: 'Dual appeal', median: '$1.52M', clearance: 72, dom: 24, change: '+2.8%', up: true,  trend: [1.36,1.38,1.40,1.42,1.43,1.45,1.47,1.48,1.49,1.50,1.51,1.52] },
  { name: 'Northcote',     type: 'House', location: 'Inner North', tag: 'Family belt', median: '$1.34M', clearance: 76, dom: 21, change: '+3.6%', up: true,  trend: [1.14,1.16,1.19,1.21,1.24,1.26,1.28,1.30,1.31,1.32,1.33,1.34] },
  { name: 'Brunswick',     type: 'House', location: 'Inner North', tag: 'Value play',  median: '$1.12M', clearance: 68, dom: 26, change: '+2.4%', up: true,  trend: [0.98,1.00,1.02,1.04,1.06,1.07,1.08,1.09,1.10,1.11,1.11,1.12] },
  { name: 'Abbotsford',    type: 'House', location: 'Inner East',  tag: 'Emerging',    median: '$1.28M', clearance: 71, dom: 23, change: '+3.0%', up: true,  trend: [1.10,1.12,1.14,1.16,1.18,1.20,1.22,1.24,1.25,1.26,1.27,1.28] },
  { name: 'Prahran',       type: 'House', location: 'Inner South', tag: 'Lifestyle',   median: '$1.35M', clearance: 73, dom: 25, change: '+2.1%', up: true,  trend: [1.20,1.22,1.24,1.25,1.27,1.28,1.29,1.30,1.32,1.33,1.34,1.35] },
  { name: 'Fitzroy North', type: 'House', location: 'Inner North', tag: 'Premium',     median: '$1.56M', clearance: 77, dom: 20, change: '+4.3%', up: true,  trend: [1.32,1.35,1.38,1.41,1.44,1.46,1.49,1.51,1.53,1.54,1.55,1.56] },
  { name: 'Carlton',       type: 'Unit',  location: 'Inner',       tag: 'Investor',    median: '$1.08M', clearance: 65, dom: 28, change: '+1.8%', up: true,  trend: [0.96,0.97,0.99,1.00,1.01,1.02,1.03,1.04,1.05,1.06,1.07,1.08] },
  { name: 'South Yarra',   type: 'House', location: 'Inner East',  tag: 'Blue chip',   median: '$1.68M', clearance: 78, dom: 18, change: '+3.9%', up: true,  trend: [1.46,1.49,1.52,1.55,1.57,1.60,1.62,1.63,1.65,1.66,1.67,1.68] },
]

const LISTING_LINKS = [
  { name: 'Fitzroy',       href: 'https://www.domain.com.au/sale/fitzroy-vic-3065/' },
  { name: 'Collingwood',   href: 'https://www.domain.com.au/sale/collingwood-vic-3066/' },
  { name: 'Richmond',      href: 'https://www.domain.com.au/sale/richmond-vic-3121/' },
  { name: 'Northcote',     href: 'https://www.domain.com.au/sale/northcote-vic-3070/' },
  { name: 'Brunswick',     href: 'https://www.domain.com.au/sale/brunswick-vic-3056/' },
  { name: 'Abbotsford',    href: 'https://www.domain.com.au/sale/abbotsford-vic-3067/' },
  { name: 'Carlton',       href: 'https://www.domain.com.au/sale/carlton-vic-3053/' },
  { name: 'Prahran',       href: 'https://www.domain.com.au/sale/prahran-vic-3181/' },
  { name: 'South Yarra',   href: 'https://www.domain.com.au/sale/south-yarra-vic-3141/' },
  { name: 'Fitzroy North', href: 'https://www.domain.com.au/sale/fitzroy-north-vic-3068/' },
]

export default function ResidentialPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [suburbs, setSuburbs] = useState(STATIC_SUBURBS)
  const [sheetLoaded, setSheetLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/suburbs')
      .then(r => r.json())
      .then(data => { setSheetLoaded(true); if (data.length > 0) setSuburbs(data) })
      .catch(() => setSheetLoaded(true))
  }, [])

  const visible = suburbs.filter(s => {
    const matchType = filter === 'All' || s.type === filter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <>
      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">Residential · Inner ring · Live data</div>
        <h1 className="page-hero-headline">Melbourne residential<br /><em>market snapshot.</em></h1>
        <p className="page-hero-sub">Auction clearance rates, median prices and 12-month price trends for Melbourne&apos;s most-watched inner suburbs. Updated every Monday.</p>
        <p style={{fontSize:'11px', color:'var(--text-muted)', letterSpacing:'0.06em', marginTop:'4px'}}>
          Last updated {new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' })}
        </p>
        <div className="search-bar-wrap">
          <input
            className="search-bar"
            type="text"
            placeholder="Search a suburb…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-primary">Search</button>
        </div>
      </div>

      {/* SUBURB GRID */}
      <section className="suburb-strip">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Inner ring · {visible.length} suburbs</div>
            <h2 className="section-title">Suburb market data</h2>
          </div>
        </div>

        <div className="filter-tabs" style={{marginBottom:'32px'}}>
          {['All','House','Unit'].map(f => (
            <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <div className="suburb-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(min(260px,100%),1fr))'}}>
          {visible.map(s => {
            const slug = s.name.toLowerCase().replace(/\s+/g, '-')
            return (
            <div className="suburb-card" key={s.name}>
              <span className="suburb-tag">{s.type}</span>
              <Link href={`/suburbs/${slug}`} style={{textDecoration:'none', color:'inherit'}}>
                <div className="suburb-name">{s.name}</div>
              </Link>
              <div className="suburb-type">{s.location} · <span style={{textTransform:'none'}}>{s.tag}</span></div>
              <div className="suburb-price">{s.median}</div>
              <div className={`suburb-change ${s.up ? 'up' : 'down'}`}>{s.up ? '↑' : '↓'} {s.change} this quarter</div>
              <div className="suburb-meta">
                <div className="suburb-meta-item">DOM<span>{s.dom} days</span></div>
                <div className="suburb-meta-item">Clearance<span>{s.clearance}%</span></div>
              </div>
              <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:`${s.clearance}%`}}></div></div>
              {s.trend && s.trend.length > 0 && <SuburbChart data={s.trend} />}
              <Link href={`/suburbs/${slug}`} style={{display:'block', marginTop:'16px', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold)', textDecoration:'none'}}>
                View suburb data →
              </Link>
            </div>
            )
          })}
          {visible.length === 0 && sheetLoaded && suburbs.length === 0 && (
            <div style={{padding:'60px', color:'var(--text-muted)', gridColumn:'1/-1', textAlign:'center'}}>Suburb data coming soon.</div>
          )}
          {visible.length === 0 && suburbs.length > 0 && (
            <div style={{padding:'40px', color:'var(--text-muted)', gridColumn:'1/-1'}}>No suburbs match your search.</div>
          )}
        </div>
      </section>

      {/* ACTIVE LISTINGS */}
      <section className="suburb-strip" style={{borderTop:'1px solid var(--navy-border)'}}>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Browse active listings · Via Domain</div>
            <h2 className="section-title">Current listings by suburb.</h2>
          </div>
        </div>
        <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', maxWidth:'520px', marginBottom:'32px'}}>
          Browse live residential listings on Domain for each inner-ring suburb. Opens in a new tab.
        </p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(200px,100%), 1fr))', gap:'1px', background:'var(--navy-border)', border:'1px solid var(--navy-border)'}}>
          {LISTING_LINKS.map(({ name, href }) => (
            <div key={name} style={{background:'var(--navy-mid)', padding:'28px 24px', display:'flex', flexDirection:'column', gap:'16px'}}>
              <div>
                <div style={{fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'8px'}}>Residential</div>
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
      <section className="section-padded" style={{padding:'60px 48px', borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div style={{maxWidth:'560px'}}>
          <div className="section-eyebrow">Weekly digest</div>
          <h2 className="section-title" style={{marginBottom:'16px'}}>Get these numbers<br />every Monday.</h2>
          <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', marginBottom:'28px'}}>Clearance rates, median shifts and market movers for Melbourne&apos;s inner ring — delivered free every Monday morning.</p>
          <a href="/#subscribe" className="btn-primary">Subscribe for free</a>
        </div>
      </section>
    </>
  )
}
