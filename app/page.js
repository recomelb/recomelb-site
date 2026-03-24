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
          <a href="#deal-of-week" className="btn-primary">Get This Week&apos;s Top Deals</a>
          <a href="#residential" className="btn-ghost">See Melbourne&apos;s Hottest Suburbs</a>
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
          <a href="#" className="section-link">View all suburbs →</a>
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
          <a href="#" className="section-link">View all precincts →</a>
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

      {/* AUDIENCE SECTION */}
      <section className="audience-section" id="for-you">
        <div className="audience-intro">
          <div className="section-eyebrow">Built for two audiences</div>
          <h2 className="section-title">Whether you&apos;re searching<br />or selling, <em style={{fontStyle:'italic', color:'var(--gold-light)'}}>we&apos;ve got you.</em></h2>
          <p>RECOMELB is purpose-built for the two groups who need Melbourne property data most — and what we give each of them is very different.</p>
        </div>
        <div className="audience-grid">

          {/* PROPERTY SEEKERS */}
          <div className="audience-panel">
            <div className="audience-panel-label">Property seekers</div>
            <h3 className="audience-panel-title">Find the opportunity<br />before <em>everyone else does.</em></h3>
            <p className="audience-panel-sub">Buyers and investors waste hours across Domain, REA and REIV trying to piece together whether a suburb is worth pursuing. RECOMELB tells you if a suburb is heating up, cooling down, or hiding an opportunity — before the rest of the market catches on.</p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553-2.276A1 1 0 0021 19.382V8.618a1 1 0 00-.553-.894L15 5m0 18V5m0 0L9 7"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Suburb comparison tool</div>
                  <div className="feature-desc">Compare up to 3 suburbs side by side — medians, clearance rates, days on market and yield, all in one view.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Suburb watchlist</div>
                  <div className="feature-desc">Save the suburbs you&apos;re tracking. Get notified when median prices shift or clearance rates move significantly.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Tailored weekly digest</div>
                  <div className="feature-desc">Subscribe with your target suburbs. Each Monday you get a personalised market update — just the data that matters to you.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Price trend charts</div>
                  <div className="feature-desc">12-month median price trend per suburb — so you can see whether a market is heating up or cooling before you commit.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Undervalued property alerts</div>
                  <div className="feature-desc">Properties listed below their suburb median flagged weekly — so you see the deals worth investigating before they&apos;re gone.</div>
                </div>
              </div>
            </div>
            <div className="audience-cta-row">
              <a href="#subscribe" className="btn-primary" style={{fontSize:'12px', padding:'12px 24px'}}>Find Undervalued Properties This Week</a>
              <div className="audience-stat"><strong>Free</strong>always</div>
            </div>
          </div>

          {/* REAL ESTATE AGENTS */}
          <div className="audience-panel">
            <div className="audience-panel-label">Real estate agents</div>
            <h3 className="audience-panel-title">Your weekly market prep,<br /><em>already done.</em></h3>
            <p className="audience-panel-sub">Agents spend hours every week manually pulling suburb data for appraisals, client updates and pitch decks. RECOMELB automates that — giving you a professional, always-current data toolkit you can share directly with clients.</p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Shareable suburb reports</div>
                  <div className="feature-desc">Generate a clean, branded PDF or shareable link for any suburb — ready to send to vendors or buyers in seconds.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Market appraisal data support</div>
                  <div className="feature-desc">Current median, comparable sales context and quarterly trend — the data layer behind every credible appraisal conversation.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Weekly client summary</div>
                  <div className="feature-desc">A pre-written, data-backed market summary every Monday — forward it to your client list or use it as the base for your own newsletter.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Commercial vacancy tracker</div>
                  <div className="feature-desc">Inner Melbourne office, retail and industrial vacancy rates updated weekly — essential context for commercial leasing pitches.</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div className="feature-text">
                  <div className="feature-title">Buyer lead capture</div>
                  <div className="feature-desc">Buyers register interest directly on RECOMELB. Leads are captured with suburb preference and budget — passed to agents in the relevant area.</div>
                </div>
              </div>
            </div>
            <div className="audience-cta-row">
              <a href="#subscribe" className="btn-primary" style={{fontSize:'12px', padding:'12px 24px'}}>Get Buyer Leads For Your Suburb</a>
              <div className="audience-stat"><strong>Free</strong>during beta</div>
            </div>
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
