import Image from 'next/image'

export const metadata = { title: 'Founder — RECOMELB' }

const HOW_IT_WORKS = [
  { num: '01', title: 'Data is collected', desc: 'Public auction results, listing data and vacancy figures are pulled every week from authoritative Melbourne property sources.' },
  { num: '02', title: 'We process and verify', desc: 'Raw data is cleaned, cross-referenced and structured into consistent suburb and precinct profiles — residential and commercial.' },
  { num: '03', title: 'Intelligence is published', desc: 'Every Monday morning, updated suburb snapshots, market heat signals and the Deal of the Week go live on RECOMELB.' },
  { num: '04', title: 'You stay ahead', desc: 'Subscribers get everything delivered to their inbox — clearance rates, suburb movers, undervalued alerts and commercial vacancy, before the week begins.' },
]

export default function AboutPage() {
  return (
    <>
      {/* FOUNDER HERO */}
      <section className="founder-section" style={{paddingTop:'140px'}}>
        <div>
          <div style={{position:'relative', width:'100%', aspectRatio:'3/4', border:'1px solid var(--navy-border)', overflow:'hidden'}}>
            <Image
              src="/founder.jpg"
              alt="Adi Agarwal — Founder, RECOMELB"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 400px"
              style={{objectFit:'cover', filter:'grayscale(100%)'}}
              priority
            />
          </div>
          <div className="founder-photo-caption">Adi Agarwal · Founder</div>
        </div>
        <div className="founder-content">
          <div className="section-eyebrow" style={{marginBottom:'16px'}}>The person behind it</div>
          <h1 className="founder-name">Adi<br />Agarwal</h1>
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

      {/* VISION & MISSION */}
      <section style={{padding:'80px 48px', borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px'}}>
          <div>
            <div className="section-eyebrow" style={{marginBottom:'16px'}}>Mission</div>
            <h2 className="section-title" style={{marginBottom:'20px'}}>Make Melbourne property<br />data accessible to everyone.</h2>
            <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.8'}}>Property data in Australia is fragmented, paywalled and confusing. RECOMELB exists to consolidate it — bringing residential and commercial intelligence together in one clean, weekly tool that anyone can use, whether they&apos;re a first-home buyer or a commercial leasing agent.</p>
          </div>
          <div>
            <div className="section-eyebrow" style={{marginBottom:'16px'}}>Values</div>
            <div style={{display:'flex', flexDirection:'column', gap:'0', border:'1px solid var(--navy-border)'}}>
              {[
                { label:'Transparency', desc:'All data sources are publicly available. We show our working.' },
                { label:'Simplicity',   desc:'Complex market data presented clearly, without jargon.' },
                { label:'Consistency',  desc:'Updated every Monday — no gaps, no missing weeks.' },
                { label:'Independence', desc:'No agent commissions. No sponsored suburb rankings.' },
              ].map(v => (
                <div key={v.label} style={{display:'flex', gap:'20px', alignItems:'flex-start', padding:'18px 20px', borderBottom:'1px solid var(--navy-border)'}}>
                  <div style={{color:'var(--gold)', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase', minWidth:'110px', paddingTop:'2px'}}>{v.label}</div>
                  <div style={{fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.5'}}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="suburb-strip">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-title">From raw data to your inbox,<br />every Monday.</h2>
          </div>
        </div>
        <div className="steps-grid">
          {HOW_IT_WORKS.map(s => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section style={{padding:'80px 48px', borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'start'}}>
          <div>
            <div className="section-eyebrow" style={{marginBottom:'16px'}}>Contact</div>
            <h2 className="section-title" style={{marginBottom:'16px'}}>Get in touch.</h2>
            <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', marginBottom:'20px'}}>Questions, feedback, data corrections or media enquiries — reach out directly. I read every message.</p>
            <a href="mailto:hello@recomelb.com.au" style={{color:'var(--gold)', fontSize:'14px', letterSpacing:'0.04em'}}>hello@recomelb.com.au</a>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">First name</label><input className="form-input" placeholder="Jane" /></div>
              <div className="form-group"><label className="form-label">Last name</label><input className="form-input" placeholder="Smith" /></div>
            </div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="jane@email.com" /></div>
            <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" rows={4} placeholder="Your message…" style={{resize:'vertical'}} /></div>
            <button className="btn-primary" style={{padding:'16px'}}>Send message</button>
          </div>
        </div>
      </section>
    </>
  )
}
