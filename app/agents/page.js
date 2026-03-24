'use client'
import { useState } from 'react'

const SUBURBS = ['Fitzroy','Collingwood','Richmond','Northcote','Brunswick','Abbotsford','Prahran','Fitzroy North','Carlton','South Yarra']

const REPORT_DATA = {
  Fitzroy:       { median: '$1.48M', clearance: '74%', dom: '22 days', growth: '+3.2%', stock: '14 listings' },
  Collingwood:   { median: '$1.39M', clearance: '79%', dom: '19 days', growth: '+4.1%', stock: '11 listings' },
  Richmond:      { median: '$1.52M', clearance: '72%', dom: '24 days', growth: '+2.8%', stock: '18 listings' },
  Northcote:     { median: '$1.34M', clearance: '76%', dom: '21 days', growth: '+3.6%', stock: '16 listings' },
  Brunswick:     { median: '$1.12M', clearance: '68%', dom: '26 days', growth: '+2.4%', stock: '22 listings' },
  Abbotsford:    { median: '$1.28M', clearance: '71%', dom: '23 days', growth: '+3.0%', stock: '13 listings' },
  Prahran:       { median: '$1.35M', clearance: '73%', dom: '25 days', growth: '+2.1%', stock: '19 listings' },
  'Fitzroy North':{ median:'$1.56M', clearance: '77%', dom: '20 days', growth: '+4.3%', stock: '9 listings'  },
  Carlton:       { median: '$1.08M', clearance: '65%', dom: '28 days', growth: '+1.8%', stock: '24 listings' },
  'South Yarra': { median: '$1.68M', clearance: '78%', dom: '18 days', growth: '+3.9%', stock: '12 listings' },
}

const vacancyData = [
  { precinct: 'CBD Core',       type: 'Office',    vacancy: '11.2%', trend: 'down',   rentPsm: '$680', leases: 142 },
  { precinct: 'Fitzroy',        type: 'Retail',    vacancy: '7.8%',  trend: 'down',   rentPsm: '$420', leases: 58  },
  { precinct: 'Port Melbourne', type: 'Industrial',vacancy: '3.1%',  trend: 'stable', rentPsm: '$195', leases: 34  },
  { precinct: 'Collingwood',    type: 'Mixed',     vacancy: '9.4%',  trend: 'up',     rentPsm: '$380', leases: 47  },
  { precinct: 'Richmond',       type: 'Office',    vacancy: '10.8%', trend: 'down',   rentPsm: '$520', leases: 63  },
  { precinct: 'South Melbourne',type: 'Retail',    vacancy: '6.9%',  trend: 'down',   rentPsm: '$440', leases: 41  },
]

const trendClass = t => t === 'down' ? 'trend-down' : t === 'up' ? 'trend-up' : 'trend-stable'
const trendIcon  = t => t === 'down' ? '↓' : t === 'up' ? '↑' : '→'

export default function AgentsPage() {
  const [reportSuburb, setReportSuburb] = useState('')
  const [generated, setGenerated] = useState(false)
  const [lead, setLead] = useState({ firstName:'', lastName:'', email:'', suburb:'', budget:'', timeline:'' })
  const [leadDone, setLeadDone] = useState(false)

  const reportData = REPORT_DATA[reportSuburb] || null

  const handleLead = () => {
    if (lead.firstName && lead.email) setLeadDone(true)
  }

  return (
    <>
      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">For agents · Real estate professionals</div>
        <h1 className="page-hero-headline">Your weekly market<br /><em>intelligence, automated.</em></h1>
        <p className="page-hero-sub">Shareable suburb reports, weekly client summaries, commercial vacancy data and direct buyer leads — everything you used to build manually, done for you.</p>
        <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
          <a href="#reports" className="btn-primary">Generate a suburb report</a>
          <a href="#leads" className="btn-ghost">View buyer leads</a>
        </div>
      </div>

      {/* REPORT GENERATOR */}
      <section className="suburb-strip" id="reports">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Suburb report generator</div>
            <h2 className="section-title">Shareable reports in seconds.</h2>
          </div>
        </div>
        <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', maxWidth:'520px', marginBottom:'32px'}}>Select a suburb to generate a clean, shareable market snapshot — ready to send to vendors or buyers instantly.</p>

        <div style={{display:'flex', gap:'12px', alignItems:'flex-end', marginBottom:'32px', flexWrap:'wrap'}}>
          <div>
            <div className="form-label" style={{marginBottom:'8px'}}>Select suburb</div>
            <select className="select-input" style={{width:'260px'}} value={reportSuburb} onChange={e => { setReportSuburb(e.target.value); setGenerated(false) }}>
              <option value="">— Choose a suburb —</option>
              {SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn-primary" onClick={() => reportSuburb && setGenerated(true)}>Generate report</button>
          {generated && <button className="btn-ghost" onClick={() => alert('PDF download coming soon.')}>Download PDF</button>}
        </div>

        {generated && reportData && (
          <div className="report-preview">
            <div className="report-preview-header">
              <div>
                <div style={{fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'6px'}}>RECOMELB · Suburb report</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:'300'}}>{reportSuburb} Market Snapshot</div>
                <div style={{fontSize:'11px', color:'var(--text-muted)', marginTop:'4px'}}>Inner Melbourne · Week 11, 2025 · Based on public data</div>
              </div>
              <div style={{fontSize:'10px', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', border:'1px solid var(--navy-border)', padding:'8px 16px'}}>Ready to share</div>
            </div>
            <div className="report-preview-grid">
              {[
                { label:'Median price',      val: reportData.median   },
                { label:'Clearance rate',    val: reportData.clearance},
                { label:'Days on market',    val: reportData.dom      },
                { label:'12-month growth',   val: reportData.growth   },
              ].map(s => (
                <div className="report-preview-stat" key={s.label}>
                  <div style={{fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px'}}>{s.label}</div>
                  <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:'300', color:'var(--gold-light)'}}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* WEEKLY SUMMARY PREVIEW */}
      <section className="suburb-strip" style={{background:'rgba(17,24,39,0.5)'}}>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Weekly client summary · Preview</div>
            <h2 className="section-title">Monday morning,<br />already written.</h2>
          </div>
        </div>
        <div style={{background:'var(--navy-mid)', border:'1px solid var(--navy-border)', padding:'40px 36px', maxWidth:'680px'}}>
          <div style={{fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'20px'}}>RECOMELB · Weekly Market Summary · Week 11, 2025</div>
          <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:'300', marginBottom:'20px', lineHeight:'1.3'}}>Inner Melbourne: Clearance rates hold strong heading into autumn</div>
          <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.8', marginBottom:'16px'}}>
            The inner ring recorded a 74% clearance rate this week across 312 auctions — the sixth consecutive week above 70%. Collingwood led the charge at 79%, while South Yarra continued to attract premium buyers with a median of $1.68M and clearance at 78%.
          </p>
          <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.8', marginBottom:'28px'}}>
            Days on market tightened across the board, with Fitzroy North averaging just 20 days — a strong signal for vendors considering an autumn campaign. Brunswick remains the value opportunity in the inner north with median entry still under $1.2M.
          </p>
          <div style={{fontSize:'11px', color:'var(--text-muted)', borderTop:'1px solid var(--navy-border)', paddingTop:'16px'}}>Forward this to your client list · recomelb.com.au · Unsubscribe any time</div>
        </div>
      </section>

      {/* COMMERCIAL VACANCY TRACKER */}
      <section className="suburb-strip">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Commercial vacancy tracker · Q1 2025</div>
            <h2 className="section-title">Inner Melbourne vacancy data.</h2>
          </div>
        </div>
        <table className="vacancy-table">
          <thead>
            <tr>
              <th>Precinct</th>
              <th>Asset class</th>
              <th>Vacancy rate</th>
              <th>Trend</th>
              <th>Avg rent /m²</th>
              <th>Active leases</th>
            </tr>
          </thead>
          <tbody>
            {vacancyData.map(row => (
              <tr key={row.precinct}>
                <td style={{fontFamily:'Cormorant Garamond, serif', fontSize:'18px', color:'var(--text-primary)'}}>{row.precinct}</td>
                <td><span className="commercial-type-badge" style={{fontSize:'9px'}}>{row.type}</span></td>
                <td style={{fontFamily:'Cormorant Garamond, serif', fontSize:'18px', color:'var(--text-primary)'}}>{row.vacancy}</td>
                <td><span className={trendClass(row.trend)}>{trendIcon(row.trend)} {row.trend}</span></td>
                <td>{row.rentPsm}</td>
                <td>{row.leases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* LEAD CAPTURE */}
      <section className="suburb-strip" id="leads" style={{background:'rgba(17,24,39,0.5)'}}>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Buyer lead capture</div>
            <h2 className="section-title">Buyers register here.<br />Leads go to you.</h2>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'start'}}>
          <div>
            <p style={{color:'var(--text-secondary)', fontSize:'14px', lineHeight:'1.7', marginBottom:'20px'}}>Buyers submit their suburb preference, budget and timeline below. RECOMELB passes those leads directly to agents covering the relevant area — free during beta.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              {[
                'Buyer details pre-qualified with suburb and budget',
                'Leads delivered to your inbox same day',
                'No fee during beta — free agent access',
              ].map(pt => (
                <div key={pt} style={{display:'flex', gap:'12px', alignItems:'flex-start', fontSize:'13px', color:'var(--text-secondary)'}}>
                  <span style={{color:'var(--gold)', marginTop:'1px'}}>→</span>{pt}
                </div>
              ))}
            </div>
          </div>

          {leadDone ? (
            <div style={{color:'#4ade80', fontSize:'14px', padding:'24px', border:'1px solid rgba(74,222,128,0.3)', background:'rgba(74,222,128,0.05)'}}>
              Interest registered. An agent covering {lead.suburb || 'your suburb'} will be in touch shortly.
            </div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">First name</label><input className="form-input" placeholder="Jane" value={lead.firstName} onChange={e => setLead(p => ({...p, firstName: e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Last name</label><input className="form-input" placeholder="Smith" value={lead.lastName} onChange={e => setLead(p => ({...p, lastName: e.target.value}))} /></div>
              </div>
              <div className="form-group"><label className="form-label">Email address</label><input className="form-input" type="email" placeholder="jane@email.com" value={lead.email} onChange={e => setLead(p => ({...p, email: e.target.value}))} /></div>
              <div className="form-group">
                <label className="form-label">Suburb of interest</label>
                <select className="form-input select-input" value={lead.suburb} onChange={e => setLead(p => ({...p, suburb: e.target.value}))}>
                  <option value="">— Select suburb —</option>
                  {SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Budget</label>
                  <select className="form-input select-input" value={lead.budget} onChange={e => setLead(p => ({...p, budget: e.target.value}))}>
                    <option value="">— Select —</option>
                    {['Under $800k','$800k–$1.2M','$1.2M–$1.6M','$1.6M–$2M','Over $2M'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Timeline</label>
                  <select className="form-input select-input" value={lead.timeline} onChange={e => setLead(p => ({...p, timeline: e.target.value}))}>
                    <option value="">— Select —</option>
                    {['ASAP','1–3 months','3–6 months','6–12 months','Just browsing'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary" style={{padding:'16px', marginTop:'4px'}} onClick={handleLead}>Register buyer interest</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
