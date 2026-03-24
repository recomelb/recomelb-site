export const metadata = { title: 'For Sellers — RECOMELB' }

const heatData = [
  { suburb: 'Fitzroy North', clearance: 77, dom: 20, growth: '+4.3%', signal: 'Hot',     bestMonth: 'Mar–May' },
  { suburb: 'Collingwood',   clearance: 79, dom: 19, growth: '+4.1%', signal: 'Hot',     bestMonth: 'Feb–Apr' },
  { suburb: 'South Yarra',   clearance: 78, dom: 18, growth: '+3.9%', signal: 'Hot',     bestMonth: 'Mar–May' },
  { suburb: 'Northcote',     clearance: 76, dom: 21, growth: '+3.6%', signal: 'Warm',    bestMonth: 'Mar–Jun' },
  { suburb: 'Fitzroy',       clearance: 74, dom: 22, growth: '+3.2%', signal: 'Warm',    bestMonth: 'Mar–May' },
  { suburb: 'Abbotsford',    clearance: 71, dom: 23, growth: '+3.0%', signal: 'Warm',    bestMonth: 'Apr–Jun' },
  { suburb: 'Richmond',      clearance: 72, dom: 24, growth: '+2.8%', signal: 'Warm',    bestMonth: 'Mar–May' },
  { suburb: 'Prahran',       clearance: 73, dom: 25, growth: '+2.1%', signal: 'Warm',    bestMonth: 'Feb–Apr' },
  { suburb: 'Brunswick',     clearance: 68, dom: 26, growth: '+2.4%', signal: 'Neutral', bestMonth: 'Mar–Jun' },
  { suburb: 'Carlton',       clearance: 65, dom: 28, growth: '+1.8%', signal: 'Neutral', bestMonth: 'Apr–Jun' },
]

const badgeClass = s => s === 'Hot' ? 'heat-hot' : s === 'Warm' ? 'heat-warm' : 'heat-neutral'

const appraisalPoints = [
  { icon: '◈', title: 'Suburb-level median',       desc: 'Current median price for houses and units in your suburb, updated weekly from public data.' },
  { icon: '◈', title: 'Comparable recent sales',   desc: '12-month rolling sales in your suburb — the data behind any credible appraisal conversation.' },
  { icon: '◈', title: 'Clearance rate context',    desc: 'Current clearance rate tells you how competitive your suburb is — a direct lever on your sale price.' },
  { icon: '◈', title: 'Days on market benchmark',  desc: 'Know what a fast or slow sale looks like so you can set realistic campaign expectations.' },
]

export default function SellersPage() {
  return (
    <>
      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">For sellers · Vendors</div>
        <h1 className="page-hero-headline">Is now the right<br /><em>time to sell?</em></h1>
        <p className="page-hero-sub">Market timing signals, suburb heat indicators and appraisal data context — so you can make the most informed decision about when and how to list.</p>
        <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
          <a href="#heat" className="btn-primary">See market heat by suburb</a>
          <a href="#appraisal" className="btn-ghost">Get appraisal data</a>
        </div>
      </div>

      {/* HEAT TABLE */}
      <section className="suburb-strip" id="heat">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Market timing signals · Inner ring</div>
            <h2 className="section-title">Suburb heat indicator.</h2>
          </div>
        </div>
        <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', maxWidth:'560px', marginBottom:'8px'}}>
          Hot = clearance above 76% and DOM under 21 days. Warm = competitive but not peak. Neutral = buyer&apos;s market conditions.
        </p>
        <table className="heat-table">
          <thead>
            <tr>
              <th>Suburb</th>
              <th>Clearance rate</th>
              <th>Days on market</th>
              <th>12-month growth</th>
              <th>Best time to list</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody>
            {heatData.map(row => (
              <tr key={row.suburb}>
                <td className="suburb-col">{row.suburb}</td>
                <td className="num-col">{row.clearance}%</td>
                <td className="num-col">{row.dom} days</td>
                <td><span className="up">{row.growth}</span></td>
                <td>{row.bestMonth}</td>
                <td><span className={`heat-badge ${badgeClass(row.signal)}`}>{row.signal}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{marginTop:'16px', fontSize:'11px', color:'var(--text-muted)'}}>Based on publicly available auction and listing data. Not financial advice.</p>
      </section>

      {/* APPRAISAL DATA */}
      <section className="audience-section" id="appraisal">
        <div className="audience-intro">
          <div className="section-eyebrow">Appraisal data support</div>
          <h2 className="section-title">Know the numbers<br />before you meet your agent.</h2>
          <p>RECOMELB gives you the same data your agent will use in their appraisal — so you walk into that conversation informed, not blind.</p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'var(--navy-border)', border:'1px solid var(--navy-border)'}}>
          {appraisalPoints.map(p => (
            <div key={p.title} style={{background:'var(--navy-mid)', padding:'36px 32px'}}>
              <div style={{color:'var(--gold)', fontSize:'20px', marginBottom:'14px'}}>{p.icon}</div>
              <div style={{fontSize:'14px', fontWeight:'500', color:'var(--text-primary)', marginBottom:'8px', letterSpacing:'0.02em'}}>{p.title}</div>
              <div style={{fontSize:'13px', color:'var(--text-muted)', lineHeight:'1.6', fontWeight:'300'}}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMING GUIDANCE */}
      <section style={{padding:'80px 48px', borderTop:'1px solid var(--navy-border)', background:'rgba(17,24,39,0.5)'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'start'}}>
          <div>
            <div className="section-eyebrow">Best time to sell</div>
            <h2 className="section-title" style={{marginBottom:'20px'}}>Autumn and spring<br />remain Melbourne&apos;s peak.</h2>
            <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', marginBottom:'16px'}}>Melbourne&apos;s inner ring historically sees the highest clearance rates and largest buyer pools in March–May (autumn) and September–November (spring). Listing outside these windows typically results in fewer bidders and lower outcomes.</p>
            <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7'}}>Current inner ring clearance: <span style={{color:'var(--gold-light)', fontFamily:'Cormorant Garamond, serif', fontSize:'20px'}}>74%</span> — conditions favour sellers heading into autumn.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'var(--navy-border)', border:'1px solid var(--navy-border)'}}>
            {[
              { season:'Autumn', months:'Mar – May', rating:'Peak', note:'Highest clearance rates historically' },
              { season:'Spring', months:'Sep – Nov', rating:'Peak', note:'Largest buyer pool of the year' },
              { season:'Summer', months:'Dec – Feb', rating:'Slow', note:'Reduced buyer competition' },
              { season:'Winter', months:'Jun – Aug', rating:'Quiet', note:'Fewer listings, fewer buyers' },
            ].map(s => (
              <div key={s.season} style={{background:'var(--navy-mid)', padding:'24px 20px'}}>
                <div style={{fontSize:'10px', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'8px'}}>{s.season}</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:'300', marginBottom:'4px'}}>{s.months}</div>
                <div style={{fontSize:'11px', color: s.rating === 'Peak' ? '#4ade80' : 'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px'}}>{s.rating}</div>
                <div style={{fontSize:'12px', color:'var(--text-muted)', lineHeight:'1.4'}}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 48px', borderTop:'1px solid var(--navy-border)'}}>
        <div style={{maxWidth:'560px'}}>
          <div className="section-eyebrow">Weekly seller briefing</div>
          <h2 className="section-title" style={{marginBottom:'16px'}}>Get clearance rates<br />and heat signals weekly.</h2>
          <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', marginBottom:'28px'}}>Know when your suburb is at peak selling conditions — delivered every Monday morning, free.</p>
          <a href="/#subscribe" className="btn-primary">Subscribe for free</a>
        </div>
      </section>
    </>
  )
}
