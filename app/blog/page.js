'use client'
import { useState, useEffect } from 'react'

const STATIC_ARTICLES = [
  {
    tag: 'Market Update', category: 'Residential',
    title: 'Inner north clearance rates hold above 70% for sixth consecutive week',
    excerpt: 'Fitzroy and Collingwood continue to outperform broader Melbourne averages as buyer competition intensifies in the sub-$1.5M bracket ahead of winter.',
    date: '17 Mar 2025', readTime: '4 min read',
  },
  {
    tag: 'Commercial', category: 'Commercial',
    title: 'Industrial vacancy tightens further as Port Melbourne demand surges',
    excerpt: 'Last-mile logistics demand pushing inner west rents to record highs, with vacancy falling below 3.5% for the first time since 2022.',
    date: '14 Mar 2025', readTime: '3 min read',
  },
  {
    tag: 'Rate Watch', category: 'Rate Watch',
    title: 'RBA hold steady — what it means for Melbourne buyers this quarter',
    excerpt: 'Borrowing capacity stable for now, but economists are split on a mid-year cut. We look at what each scenario means for inner-ring property values.',
    date: '12 Mar 2025', readTime: '5 min read',
  },
  {
    tag: 'Analysis', category: 'Analysis',
    title: 'South Yarra emerges as Melbourne\'s top-performing suburb in Q1 2025',
    excerpt: 'Blue-chip inner east continues to attract premium buyers. Median now $1.68M with clearance holding at 78% through the autumn campaign season.',
    date: '10 Mar 2025', readTime: '6 min read',
  },
  {
    tag: 'Residential', category: 'Residential',
    title: 'Carlton versus Fitzroy North: which inner-north suburb wins in 2025?',
    excerpt: 'Two of Melbourne\'s most-watched suburbs, two very different value propositions. We compare 12-month growth, yield and days on market.',
    date: '7 Mar 2025', readTime: '7 min read',
  },
  {
    tag: 'Commercial', category: 'Commercial',
    title: 'CBD office vacancy stabilises — is the worst over for Melbourne offices?',
    excerpt: 'After three years of rising vacancy, CBD Core office vacancy appears to be plateauing at 11.2%. What the data says about where it goes from here.',
    date: '5 Mar 2025', readTime: '5 min read',
  },
]

const CATS = ['All', 'Residential', 'Commercial', 'Rate Watch', 'Analysis']

export default function BlogPage() {
  const [cat, setCat] = useState('All')
  const [articles, setArticles] = useState(STATIC_ARTICLES)
  const [sheetLoaded, setSheetLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => { setSheetLoaded(true); if (data.length > 0) setArticles(data) })
      .catch(() => setSheetLoaded(true))
  }, [])

  const visible = cat === 'All' ? articles : articles.filter(a => a.category === cat)

  return (
    <>
      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">Intelligence · News & analysis</div>
        <h1 className="page-hero-headline">Melbourne market<br /><em>intelligence.</em></h1>
        <p className="page-hero-sub">Auction results, suburb trends, commercial leasing updates and rate watch analysis — published every week, based on real data.</p>
      </div>

      {/* ARTICLES */}
      <section className="suburb-strip">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Latest articles · {visible.length} results</div>
            <h2 className="section-title">Recent intelligence</h2>
          </div>
        </div>

        <div className="filter-tabs" style={{marginBottom:'40px'}}>
          {CATS.map(c => (
            <button key={c} className={`filter-tab${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        <div className="article-grid">
          {visible.map(a => (
            <div className="article-card" key={a.title}>
              <div className="article-card-body">
                <div style={{marginBottom:'16px'}}>
                  <span className="news-tag">{a.tag}</span>
                </div>
                <h3 className="article-title">{a.title}</h3>
                <p className="article-excerpt">{a.excerpt}</p>
              </div>
              <div className="article-meta">
                <span className="article-date">{a.date}</span>
                <span style={{color:'var(--navy-border)'}}>·</span>
                <span className="article-date">{a.readTime}</span>
              </div>
            </div>
          ))}
          {visible.length === 0 && sheetLoaded && articles.length === 0 && (
            <div style={{padding:'48px', color:'var(--text-muted)', gridColumn:'1/-1'}}>Articles coming soon.</div>
          )}
          {visible.length === 0 && articles.length > 0 && (
            <div style={{padding:'48px', color:'var(--text-muted)', gridColumn:'1/-1'}}>No articles in this category yet.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 48px', borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div style={{maxWidth:'560px'}}>
          <div className="section-eyebrow">Weekly digest</div>
          <h2 className="section-title" style={{marginBottom:'16px'}}>Get every article<br />delivered Monday.</h2>
          <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', marginBottom:'28px'}}>All the week&apos;s intelligence — residential data, commercial updates and rate watch — in one clean email. Free.</p>
          <a href="/#subscribe" className="btn-primary">Subscribe for free</a>
        </div>
      </section>
    </>
  )
}
