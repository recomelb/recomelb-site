'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  useEffect(() => {
    let countTimer = null
    function animateCount(target, suffix) {
      if (countTimer) clearInterval(countTimer)
      let c = 0
      const el = document.getElementById('clearance-rate')
      if (!el) return
      countTimer = setInterval(() => {
        c += 2
        if (c >= target) { c = target; clearInterval(countTimer) }
        el.textContent = c + suffix
      }, 20)
    }
    animateCount(74, '%')

    const cards = document.querySelectorAll('.suburb-card, .commercial-card, .news-card')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.animation = `fadeUp 0.5s ease both ${i * 0.07}s`
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })
    cards.forEach(c => obs.observe(c))

    return () => {
      if (countTimer) clearInterval(countTimer)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-line"></div>

        <div className="brand-name">
          <span className="brand-active">Residential</span>
          <span className="brand-sep">·</span>
          <span className="brand-active">Commercial</span>
          <span className="brand-sep">·</span>
          <span>Melbourne</span>
        </div>

        <div className="hero-eyebrow">Melbourne property intelligence</div>

        <h1 className="hero-headline">
          The inner city<br />market, <em>clearly</em><br />understood.
        </h1>

        <p className="hero-sub">
          Real-time suburb data, auction results and market intelligence for Melbourne&apos;s inner ring. Updated every Monday.
        </p>

        <div className="hero-actions">
          <Link href="/buyers" className="btn-primary">Get This Week&apos;s Top Deals</Link>
          <Link href="/residential" className="btn-ghost">See Melbourne&apos;s Hottest Suburbs</Link>
        </div>

        {/* LIVE STATS PANEL */}
        <div className="live-ticker">
          <div className="ticker-label">
            <span className="live-dot"></span>
            <span>Live · Week 11, 2025</span>
          </div>
          <div className="stat-hero">
            <div className="stat-hero-num" id="clearance-rate">0%</div>
            <div className="stat-hero-label">Auction clearance rate</div>
            <div className="stat-hero-date">Inner Melbourne · Sat 15 Mar</div>
          </div>
          <div className="mini-stats">
            <div className="mini-stat">
              <div className="mini-stat-num">312</div>
              <div className="mini-stat-label">Auctions held</div>
              <div className="mini-stat-change up">↑ 18 vs last week</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-num">$1.42M</div>
              <div className="mini-stat-label">Median sale</div>
              <div className="mini-stat-change up">↑ 2.1% QoQ</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-num">23</div>
              <div className="mini-stat-label">Days on market</div>
              <div className="mini-stat-change down">↓ 3 vs last month</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-num">4.2%</div>
              <div className="mini-stat-label">Rental yield avg</div>
              <div className="mini-stat-change up">↑ 0.3% YoY</div>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line"></div>
          Scroll to explore
        </div>
      </section>

      {/* RESIDENTIAL SECTION */}
      <section className="suburb-strip" id="residential">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Residential · Inner ring</div>
            <h2 className="section-title">Suburb market snapshot</h2>
          </div>
          <Link href="/residential" className="section-link">View all suburbs →</Link>
        </div>
        <div className="suburb-grid">
          <div className="suburb-card">
            <span className="suburb-tag">House</span>
            <div className="suburb-name">Fitzroy</div>
            <div className="suburb-type">Inner North · High demand</div>
            <div className="suburb-price">$1.48M</div>
            <div className="suburb-change up">↑ 3.2% this quarter</div>
            <div className="suburb-meta">
              <div className="suburb-meta-item">DOM<span>22 days</span></div>
              <div className="suburb-meta-item">Clearance<span>74%</span></div>
            </div>
            <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:'74%'}}></div></div>
          </div>
          <div className="suburb-card">
            <span className="suburb-tag">House</span>
            <div className="suburb-name">Collingwood</div>
            <div className="suburb-type">Inner North · Rising fast</div>
            <div className="suburb-price">$1.39M</div>
            <div className="suburb-change up">↑ 4.1% this quarter</div>
            <div className="suburb-meta">
              <div className="suburb-meta-item">DOM<span>19 days</span></div>
              <div className="suburb-meta-item">Clearance<span>79%</span></div>
            </div>
            <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:'79%'}}></div></div>
          </div>
          <div className="suburb-card">
            <span className="suburb-tag">House</span>
            <div className="suburb-name">Richmond</div>
            <div className="suburb-type">Inner East · Dual appeal</div>
            <div className="suburb-price">$1.52M</div>
            <div className="suburb-change up">↑ 2.8% this quarter</div>
            <div className="suburb-meta">
              <div className="suburb-meta-item">DOM<span>24 days</span></div>
              <div className="suburb-meta-item">Clearance<span>72%</span></div>
            </div>
            <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:'72%'}}></div></div>
          </div>
          <div className="suburb-card">
            <span className="suburb-tag">House</span>
            <div className="suburb-name">Northcote</div>
            <div className="suburb-type">Inner North · Family belt</div>
            <div className="suburb-price">$1.34M</div>
            <div className="suburb-change up">↑ 3.6% this quarter</div>
            <div className="suburb-meta">
              <div className="suburb-meta-item">DOM<span>21 days</span></div>
              <div className="suburb-meta-item">Clearance<span>76%</span></div>
            </div>
            <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:'76%'}}></div></div>
          </div>
        </div>
      </section>

      {/* COMMERCIAL SECTION */}
      <section className="suburb-strip" id="commercial">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Commercial · Inner Melbourne</div>
            <h2 className="section-title">Commercial market snapshot</h2>
          </div>
          <Link href="/commercial" className="section-link">View all precincts →</Link>
        </div>
        <div className="commercial-grid">
          <div className="commercial-card">
            <span className="commercial-type-badge">Office</span>
            <div className="commercial-name">CBD Core</div>
            <div className="commercial-sub">Collins St precinct</div>
            <div className="commercial-yield">6.8%</div>
            <div className="commercial-yield-label">Net yield</div>
            <div className="suburb-change up">↑ 0.4% this quarter</div>
            <div className="commercial-meta">
              <div className="commercial-meta-item">Vacancy<span>11.2%</span></div>
              <div className="commercial-meta-item">Avg rent<span>$680/m²</span></div>
            </div>
            <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:'68%'}}></div></div>
          </div>
          <div className="commercial-card">
            <span className="commercial-type-badge">Retail</span>
            <div className="commercial-name">Fitzroy</div>
            <div className="commercial-sub">Brunswick St strip</div>
            <div className="commercial-yield">5.4%</div>
            <div className="commercial-yield-label">Net yield</div>
            <div className="suburb-change up">↑ 0.6% this quarter</div>
            <div className="commercial-meta">
              <div className="commercial-meta-item">Vacancy<span>7.8%</span></div>
              <div className="commercial-meta-item">Avg rent<span>$420/m²</span></div>
            </div>
            <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:'54%'}}></div></div>
          </div>
          <div className="commercial-card">
            <span className="commercial-type-badge">Industrial</span>
            <div className="commercial-name">Port Melbourne</div>
            <div className="commercial-sub">Inner west logistics</div>
            <div className="commercial-yield">5.9%</div>
            <div className="commercial-yield-label">Net yield</div>
            <div className="suburb-change up">↑ 1.2% this quarter</div>
            <div className="commercial-meta">
              <div className="commercial-meta-item">Vacancy<span>3.1%</span></div>
              <div className="commercial-meta-item">Avg rent<span>$195/m²</span></div>
            </div>
            <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:'59%'}}></div></div>
          </div>
          <div className="commercial-card">
            <span className="commercial-type-badge">Mixed use</span>
            <div className="commercial-name">Collingwood</div>
            <div className="commercial-sub">Smith St precinct</div>
            <div className="commercial-yield">5.1%</div>
            <div className="commercial-yield-label">Net yield</div>
            <div className="suburb-change down">↓ 0.2% this quarter</div>
            <div className="commercial-meta">
              <div className="commercial-meta-item">Vacancy<span>9.4%</span></div>
              <div className="commercial-meta-item">Avg rent<span>$380/m²</span></div>
            </div>
            <div className="suburb-bar-wrap"><div className="suburb-bar" style={{width:'51%'}}></div></div>
          </div>
        </div>
      </section>

      {/* DEAL OF THE WEEK */}
      <section className="deal-section" id="deal-of-week">
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
            <div className="deal-why">
              Priced below the suburb unit median in one of Melbourne&apos;s most tightly held inner-north suburbs. Strong rental demand from professionals and students. Limited comparable stock under $600k.
            </div>
            <a href="#subscribe" className="btn-primary">View full analysis →</a>
          </div>
          <div className="deal-card-stats">
            <div className="deal-stat-row">
              <span className="deal-stat-label">Suburb median (house)</span>
              <span className="deal-stat-value">$1,480,000</span>
            </div>
            <div className="deal-stat-row">
              <span className="deal-stat-label">Suburb median (unit)</span>
              <span className="deal-stat-value">$620,000</span>
            </div>
            <div className="deal-stat-row">
              <span className="deal-stat-label">Est. gross rental yield</span>
              <span className="deal-stat-value highlight">4.8%</span>
            </div>
            <div className="deal-stat-row">
              <span className="deal-stat-label">12-month suburb growth</span>
              <span className="deal-stat-value highlight">+3.2%</span>
            </div>
            <div className="deal-stat-row">
              <span className="deal-stat-label">Days on market</span>
              <span className="deal-stat-value">18 days</span>
            </div>
          </div>
        </div>
        <p className="deal-disclaimer">New deal analysed every Monday. Based on publicly available data — not financial advice.</p>
      </section>

      {/* SIGNPOST SECTION */}
      <section className="suburb-strip" id="for-you">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Where do you fit?</div>
            <h2 className="section-title">Find what&apos;s built for you.</h2>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1px', background:'var(--navy-border)', border:'1px solid var(--navy-border)'}}>
          <Link href="/buyers" style={{display:'block', background:'var(--navy-mid)', padding:'48px 36px', textDecoration:'none', transition:'background 0.2s'}} onMouseEnter={e => e.currentTarget.style.background='var(--navy-dark)'} onMouseLeave={e => e.currentTarget.style.background='var(--navy-mid)'}>
            <div style={{fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'20px'}}>Buyers &amp; Renters</div>
            <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:'300', color:'var(--text-primary)', lineHeight:'1.2', marginBottom:'16px'}}>I&apos;m looking to<br />buy or rent.</div>
            <div style={{fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'28px'}}>Suburb comparisons, undervalued alerts, clearance rates and weekly deal intelligence — so you find the right property before everyone else does.</div>
            <div style={{color:'var(--gold)', fontSize:'13px', letterSpacing:'0.06em'}}>Explore buyer tools →</div>
          </Link>
          <Link href="/sellers" style={{display:'block', background:'var(--navy-mid)', padding:'48px 36px', textDecoration:'none', transition:'background 0.2s'}} onMouseEnter={e => e.currentTarget.style.background='var(--navy-dark)'} onMouseLeave={e => e.currentTarget.style.background='var(--navy-mid)'}>
            <div style={{fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'20px'}}>Vendors</div>
            <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:'300', color:'var(--text-primary)', lineHeight:'1.2', marginBottom:'16px'}}>I&apos;m selling my<br />property.</div>
            <div style={{fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'28px'}}>Market timing signals, suburb heat indicators and appraisal data context — so you know exactly when conditions favour a sale.</div>
            <div style={{color:'var(--gold)', fontSize:'13px', letterSpacing:'0.06em'}}>See seller intelligence →</div>
          </Link>
          <Link href="/agents" style={{display:'block', background:'var(--navy-mid)', padding:'48px 36px', textDecoration:'none', transition:'background 0.2s'}} onMouseEnter={e => e.currentTarget.style.background='var(--navy-dark)'} onMouseLeave={e => e.currentTarget.style.background='var(--navy-mid)'}>
            <div style={{fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'20px'}}>Agents</div>
            <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:'300', color:'var(--text-primary)', lineHeight:'1.2', marginBottom:'16px'}}>I&apos;m a real estate<br />agent.</div>
            <div style={{fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6', marginBottom:'28px'}}>Shareable suburb reports, weekly client summaries, commercial vacancy data and direct buyer leads — your market prep, already done.</div>
            <div style={{color:'var(--gold)', fontSize:'13px', letterSpacing:'0.06em'}}>Access agent tools →</div>
          </Link>
        </div>
      </section>

      {/* SELLERS SECTION */}
      <section className="suburb-strip" id="sellers" style={{borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'start'}}>
          <div>
            <div className="section-eyebrow" style={{marginBottom:'16px'}}>Thinking of selling?</div>
            <h2 className="section-title" style={{marginBottom:'20px'}}>Is now the right<br />time to sell?</h2>
            <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.8', marginBottom:'32px'}}>Market conditions vary week to week — and timing your sale to peak clearance rates can meaningfully affect your outcome. RECOMELB gives you the signals your agent will use, before you sit down with them.</p>
            <Link href="/sellers" className="btn-primary">Check your suburb →</Link>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'1px', background:'var(--navy-border)', border:'1px solid var(--navy-border)'}}>
            {[
              { icon: '◈', title: 'Market heat indicator',   desc: 'Hot, Warm or Neutral signal for your suburb — based on live clearance rates and days on market.' },
              { icon: '◈', title: 'Avg days on market',      desc: 'Know what a fast or slow campaign looks like so you can set realistic expectations.' },
              { icon: '◈', title: 'Comparable sales data',   desc: '12-month rolling sales in your suburb — the same data behind any credible appraisal.' },
              { icon: '◈', title: 'Seasonal timing guide',   desc: 'Autumn and spring historically peak for inner Melbourne. See where the current week sits.' },
            ].map(f => (
              <div key={f.title} style={{background:'var(--navy-mid)', padding:'24px 28px', display:'flex', gap:'16px', alignItems:'flex-start'}}>
                <div style={{color:'var(--gold)', fontSize:'16px', marginTop:'1px', flexShrink:0}}>{f.icon}</div>
                <div>
                  <div style={{fontSize:'13px', fontWeight:'500', color:'var(--text-primary)', marginBottom:'4px', letterSpacing:'0.02em'}}>{f.title}</div>
                  <div style={{fontSize:'12px', color:'var(--text-muted)', lineHeight:'1.6', fontWeight:'300'}}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className="news-section" id="news">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Intelligence · This week</div>
            <h2 className="section-title">Melbourne market news</h2>
          </div>
          <a href="#" className="section-link">All articles →</a>
        </div>
        <div className="news-grid">
          <div className="news-card">
            <div className="news-tag">Market update</div>
            <h3 className="news-title">Inner north clearance rates hold above 70% for sixth consecutive week</h3>
            <p className="news-excerpt">Fitzroy and Collingwood continue to outperform broader Melbourne averages as buyer competition intensifies in the sub-$1.5M bracket ahead of winter.</p>
            <div className="news-date">17 Mar 2025 · 4 min read</div>
          </div>
          <div className="news-card news-card-sm">
            <div className="news-tag">Commercial</div>
            <h3 className="news-title">Industrial vacancy tightens further as Port Melbourne demand surges</h3>
            <p className="news-excerpt">Last-mile logistics demand pushing inner west rents to record highs.</p>
            <div className="news-date">14 Mar 2025</div>
          </div>
          <div className="news-card news-card-sm">
            <div className="news-tag">Rate watch</div>
            <h3 className="news-title">RBA hold steady — what it means for Melbourne buyers</h3>
            <p className="news-excerpt">Borrowing capacity stable for now, but economists split on a mid-year cut.</p>
            <div className="news-date">12 Mar 2025</div>
          </div>
        </div>
      </section>

      {/* EMAIL SIGNUP */}
      <section className="email-section" id="subscribe">
        <div>
          <h2 className="email-headline">Get Melbourne&apos;s Best Property Deals<br /><em>Before Everyone Else.</em></h2>
          <p className="email-sub">Undervalued properties, suburb trends and market intelligence — delivered every Monday morning. Free.</p>
        </div>
        <div>
          <div className="email-form">
            <input type="text" className="email-input" placeholder="First name" />
            <input type="email" className="email-input" placeholder="Email address" />
            <button className="btn-primary" style={{padding:'16px'}}>Send Me This Week&apos;s Deals</button>
            <div className="email-promise">Published weekly · No spam · Unsubscribe any time</div>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="founder-section" id="about">
        <div>
          <div className="founder-photo-placeholder">
            <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="24" r="14" fill="none" stroke="#c9a84c" strokeWidth="1.5"/>
              <path d="M6 58c0-14.4 11.6-26 26-26s26 11.6 26 26" fill="none" stroke="#c9a84c" strokeWidth="1.5"/>
            </svg>
            <div className="founder-photo-placeholder-text">Photo coming soon</div>
          </div>
          <div className="founder-photo-caption">Adi Agarwal · Founder</div>
        </div>
        <div className="founder-content">
          <div className="section-eyebrow" style={{marginBottom:'16px'}}>The person behind it</div>
          <h2 className="founder-name">Adi<br />Agarwal</h2>
          <div className="founder-title">Founder · RECOMELB</div>
          <p className="founder-bio">
            Fascinated by Melbourne&apos;s real estate market — its volatility, its monopolies, and the data hiding in plain sight. While searching for my own apartment in the CBD, I realised how fragmented the information landscape was for buyers, renters and agents alike. The data existed. It just wasn&apos;t in one place, and it wasn&apos;t being used smartly.
          </p>
          <p className="founder-bio" style={{marginTop:'-12px'}}>
            I started building automations to aggregate and process market data for myself. What began as a personal tool quickly revealed a bigger opportunity — to make the lives of real estate professionals genuinely simpler through accessible, well-presented intelligence.
          </p>
          <div className="founder-vision">
            <div className="founder-vision-label">Vision</div>
            <div className="founder-vision-text">&ldquo;A single source of truth for Melbourne property — residential and commercial — built for the people who live, work and invest in this city.&rdquo;</div>
          </div>
          <div className="founder-links">
            <a href="https://www.linkedin.com/in/adi-aggarwal-4495b7376/" target="_blank" rel="noopener noreferrer" className="founder-link">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <a href="mailto:hello@recomelb.com.au" className="founder-link">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Get in touch
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
