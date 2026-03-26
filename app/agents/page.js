'use client'
import { useState, useEffect, useCallback } from 'react'

// ─── Static fallbacks ──────────────────────────────────────────────────────
const STATIC_SUBURBS = [
  { name: 'Fitzroy North', median: '$1.56M', clearance: 77, dom: 20, change: '+4.3%', yield: '3.4%', trend: [1.42,1.45,1.48,1.51,1.53,1.56] },
  { name: 'Collingwood',   median: '$1.39M', clearance: 79, dom: 19, change: '+4.1%', yield: '3.6%', trend: [1.28,1.30,1.33,1.35,1.37,1.39] },
  { name: 'South Yarra',   median: '$1.68M', clearance: 78, dom: 18, change: '+3.9%', yield: '3.2%', trend: [1.55,1.58,1.61,1.63,1.66,1.68] },
  { name: 'Northcote',     median: '$1.34M', clearance: 76, dom: 21, change: '+3.6%', yield: '3.9%', trend: [1.22,1.25,1.27,1.29,1.31,1.34] },
  { name: 'Fitzroy',       median: '$1.48M', clearance: 74, dom: 22, change: '+3.2%', yield: '3.8%', trend: [1.38,1.40,1.42,1.44,1.46,1.48] },
  { name: 'Abbotsford',    median: '$1.28M', clearance: 71, dom: 23, change: '+3.0%', yield: '3.7%', trend: [1.20,1.22,1.23,1.25,1.26,1.28] },
  { name: 'Richmond',      median: '$1.52M', clearance: 72, dom: 24, change: '+2.8%', yield: '3.5%', trend: [1.43,1.45,1.47,1.48,1.50,1.52] },
  { name: 'Prahran',       median: '$1.35M', clearance: 73, dom: 25, change: '+2.1%', yield: '3.6%', trend: [1.30,1.31,1.32,1.33,1.34,1.35] },
  { name: 'Brunswick',     median: '$1.12M', clearance: 68, dom: 26, change: '+2.4%', yield: '4.1%', trend: [1.06,1.07,1.08,1.09,1.10,1.12] },
  { name: 'Carlton',       median: '$1.08M', clearance: 65, dom: 28, change: '+1.8%', yield: '4.3%', trend: [1.03,1.04,1.05,1.06,1.07,1.08] },
]

const STATIC_COMMERCIAL = [
  { name: 'CBD Core',        type: 'Office',     vacancy: '11.2%', rent: '$680/m²', change: '+1.2%', up: true  },
  { name: 'Fitzroy',         type: 'Retail',     vacancy: '7.8%',  rent: '$420/m²', change: '+0.8%', up: true  },
  { name: 'Port Melbourne',  type: 'Industrial', vacancy: '3.1%',  rent: '$195/m²', change: '+2.1%', up: true  },
  { name: 'Collingwood',     type: 'Mixed',      vacancy: '9.4%',  rent: '$380/m²', change: '-0.4%', up: false },
  { name: 'Richmond',        type: 'Office',     vacancy: '10.8%', rent: '$520/m²', change: '+0.6%', up: true  },
  { name: 'South Melbourne', type: 'Retail',     vacancy: '6.9%',  rent: '$440/m²', change: '+1.1%', up: true  },
]

// ─── PDF generator ─────────────────────────────────────────────────────────
async function buildPDF(suburb) {
  const { jsPDF } = await import('jspdf')
  const doc  = new jsPDF()
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  // Gold header bar
  doc.setFillColor(212, 175, 55)
  doc.rect(0, 0, 210, 10, 'F')

  // Brand line
  doc.setFontSize(8)
  doc.setTextColor(10, 15, 28)
  doc.setFont('helvetica', 'bold')
  doc.text('RECOMELB', 14, 7)

  // Suburb headline
  doc.setFontSize(30)
  doc.setTextColor(212, 175, 55)
  doc.setFont('helvetica', 'bold')
  doc.text(suburb.name, 14, 28)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')
  doc.text(`Suburb Intelligence Report  ·  ${date}`, 14, 36)

  // Divider
  doc.setDrawColor(212, 175, 55)
  doc.setLineWidth(0.4)
  doc.line(14, 41, 196, 41)

  // Stats grid
  const stats = [
    ['MEDIAN PRICE',     suburb.median   || '—'],
    ['CLEARANCE RATE',   suburb.clearance != null ? suburb.clearance + '%' : '—'],
    ['DAYS ON MARKET',   suburb.dom       != null ? suburb.dom + ' days'   : '—'],
    ['QUARTERLY CHANGE', suburb.change   || '—'],
    ['RENTAL YIELD',     suburb.yield    || '—'],
  ]

  let y = 52
  stats.forEach(([label, value], i) => {
    const x = i % 2 === 0 ? 14 : 110
    if (i % 2 === 0 && i > 0) y += 28

    doc.setFontSize(7)
    doc.setTextColor(140, 140, 140)
    doc.setFont('helvetica', 'bold')
    doc.text(label, x, y)

    doc.setFontSize(20)
    doc.setTextColor(10, 15, 28)
    doc.setFont('helvetica', 'normal')
    doc.text(value, x, y + 9)
  })

  // Trend table
  if (Array.isArray(suburb.trend) && suburb.trend.length > 0) {
    y += 42
    doc.setFontSize(8)
    doc.setTextColor(212, 175, 55)
    doc.setFont('helvetica', 'bold')
    doc.text('PRICE TREND (6 PERIODS, $M)', 14, y)

    y += 6
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.2)
    doc.line(14, y, 196, y)

    suburb.trend.forEach((val, i) => {
      y += 7
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      doc.text(`Period ${i + 1}`, 14, y)
      doc.setTextColor(10, 15, 28)
      doc.text(`$${Number(val).toFixed(2)}M`, 80, y)
      doc.setDrawColor(230, 230, 230)
      doc.line(14, y + 1.5, 196, y + 1.5)
    })
  }

  // Footer
  doc.setFontSize(7.5)
  doc.setTextColor(160, 160, 160)
  doc.setFont('helvetica', 'normal')
  doc.text('Data source: RECOMELB · recomelb-site.vercel.app · Based on publicly available data · Not financial advice', 14, 284)

  doc.setFillColor(212, 175, 55)
  doc.rect(0, 287, 210, 3, 'F')

  doc.save(`RECOMELB-${suburb.name.replace(/ /g, '-')}-Report.pdf`)
}

// ─── Weekly summary text generator ─────────────────────────────────────────
function buildSummary(suburbs) {
  const src  = suburbs.length ? suburbs : STATIC_SUBURBS
  const top3 = [...src].sort((a, b) => (b.clearance || 0) - (a.clearance || 0)).slice(0, 3)
  const avg  = Math.round(src.reduce((s, r) => s + (r.clearance || 0), 0) / src.length)
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  return `RECOMELB · Weekly Market Summary · ${date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INNER MELBOURNE: Market Conditions Update

The inner ring recorded an average clearance rate of ${avg}% this week.${
  top3[0] ? ` ${top3[0].name} led at ${top3[0].clearance}%` : ''}${
  top3[1] ? `, followed by ${top3[1].name} at ${top3[1].clearance}%` : ''}${
  top3[2] ? ` and ${top3[2].name} at ${top3[2].clearance}%.` : '.'}

TOP SUBURBS BY CLEARANCE RATE:
${top3.map(s =>
  `• ${s.name}: Median ${s.median || '—'} · Clearance ${s.clearance || '—'}% · ${s.dom || '—'} days on market · ${s.change || '—'} quarterly`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data: RECOMELB · recomelb-site.vercel.app
Updated weekly · Not financial advice`
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [suburbs,    setSuburbs]    = useState(STATIC_SUBURBS)
  const [commercial, setCommercial] = useState(STATIC_COMMERCIAL)
  const [reportName, setReportName] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [lead,       setLead]       = useState({ name: '', email: '', suburb: '', budget: '', timeline: '' })
  const [leadStatus, setLeadStatus] = useState('idle')   // idle | loading | success | error
  const [leadError,  setLeadError]  = useState('')

  useEffect(() => {
    fetch('/api/suburbs')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setSuburbs(d) })
      .catch(() => {})
    fetch('/api/commercial')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setCommercial(d) })
      .catch(() => {})
  }, [])

  const selectedSuburb = suburbs.find(s => s.name === reportName) || null
  const summaryText    = buildSummary(suburbs)

  async function handleDownloadPDF() {
    if (!selectedSuburb) return
    setPdfLoading(true)
    try { await buildPDF(selectedSuburb) }
    catch (e) { console.error('PDF error', e) }
    finally { setPdfLoading(false) }
  }

  function handleCopy() {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  async function handleLeadSubmit() {
    if (!lead.email) return
    setLeadStatus('loading')
    setLeadError('')
    try {
      const res  = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(lead),
      })
      const data = await res.json()
      if (data.success) { setLeadStatus('success') }
      else { setLeadError(data.error || 'Something went wrong.'); setLeadStatus('error') }
    } catch {
      setLeadError('Something went wrong. Please try again.')
      setLeadStatus('error')
    }
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">For agents · Real estate professionals</div>
        <h1 className="page-hero-headline">Your weekly market<br /><em>intelligence, automated.</em></h1>
        <p className="page-hero-sub">Shareable suburb reports, weekly client summaries, commercial vacancy data and direct buyer leads — everything you used to build manually, done for you.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="#reports"    className="btn-primary">Generate a suburb report</a>
          <a href="#leads"      className="btn-ghost">Capture buyer leads</a>
        </div>
      </div>

      {/* ── REPORT GENERATOR ─────────────────────────────────────────────── */}
      <section className="suburb-strip" id="reports">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Suburb report generator · {suburbs.length} suburbs</div>
            <h2 className="section-title">Branded PDF reports in seconds.</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', maxWidth: '520px', marginBottom: '32px' }}>
          Select a suburb to preview a live market snapshot, then download a branded PDF ready to share with vendors or buyers.
        </p>

        {/* Suburb selector */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Select suburb
            </div>
            <select
              className="select-input"
              style={{ width: '260px' }}
              value={reportName}
              onChange={e => setReportName(e.target.value)}
            >
              <option value="">— Choose a suburb —</option>
              {suburbs.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          {selectedSuburb && (
            <button
              className="btn-primary"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              style={{ opacity: pdfLoading ? 0.7 : 1 }}
            >
              {pdfLoading ? 'Generating…' : 'Download PDF report'}
            </button>
          )}
        </div>

        {/* Live preview card */}
        {selectedSuburb ? (
          <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-border)' }}>
            {/* Card header */}
            <div style={{ background: 'var(--navy-dark)', borderBottom: '1px solid var(--navy-border)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
                  RECOMELB · Suburb Intelligence Report
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: '300', color: 'var(--text-primary)', lineHeight: '1.1' }}>
                  {selectedSuburb.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Inner Melbourne · {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '6px 14px', opacity: 0.8 }}>
                Preview
              </div>
            </div>

            {/* Stats grid */}
            <div className="preview-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: 'var(--navy-border)' }}>
              {[
                { label: 'Median price',     value: selectedSuburb.median   || '—' },
                { label: 'Clearance rate',   value: selectedSuburb.clearance != null ? selectedSuburb.clearance + '%' : '—' },
                { label: 'Days on market',   value: selectedSuburb.dom       != null ? selectedSuburb.dom + ' days'   : '—' },
                { label: 'Qtr change',       value: selectedSuburb.change   || '—' },
                { label: 'Rental yield',     value: selectedSuburb.yield    || '—' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'var(--navy-mid)', padding: '24px 20px' }}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: '300', color: 'var(--gold-light)' }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Trend table */}
            {Array.isArray(selectedSuburb.trend) && selectedSuburb.trend.length > 0 && (
              <div style={{ padding: '24px 32px', borderTop: '1px solid var(--navy-border)' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Price trend · 6 periods ($M)
                </div>
                <div style={{ display: 'flex', gap: '0', background: 'var(--navy-border)' }}>
                  {selectedSuburb.trend.map((val, i) => (
                    <div key={i} style={{ flex: 1, background: 'var(--navy-dark)', padding: '12px 16px', borderRight: i < selectedSuburb.trend.length - 1 ? '1px solid var(--navy-border)' : 'none' }}>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '4px' }}>P{i + 1}</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: i === selectedSuburb.trend.length - 1 ? 'var(--gold-light)' : 'var(--text-primary)' }}>
                        ${Number(val).toFixed(2)}M
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: '12px 32px', borderTop: '1px solid var(--navy-border)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Data source: RECOMELB · recomelb-site.vercel.app · Based on publicly available data · Not financial advice
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '48px', border: '1px solid var(--navy-border)', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>
            Select a suburb above to preview its report.
          </div>
        )}
      </section>

      {/* ── WEEKLY CLIENT SUMMARY ─────────────────────────────────────────── */}
      <section className="suburb-strip" style={{ background: 'rgba(17,24,39,0.5)' }}>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Weekly client summary · Auto-generated</div>
            <h2 className="section-title">Monday morning,<br />already written.</h2>
          </div>
          <button
            onClick={handleCopy}
            style={{
              fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '10px 20px', border: '1px solid',
              borderColor: copied ? '#4ade80' : 'var(--gold)',
              color:       copied ? '#4ade80' : 'var(--gold)',
              background:  copied ? 'rgba(74,222,128,0.08)' : 'rgba(212,175,55,0.06)',
              cursor: 'pointer', alignSelf: 'center', transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy to clipboard'}
          </button>
        </div>

        <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-border)', padding: '36px', maxWidth: '700px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>
            {'RECOMELB · Weekly Market Summary · '}
            {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {'\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'}
          <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>INNER MELBOURNE: Market Conditions Update</span>
          {'\n\n'}
          {(() => {
            const top3 = [...suburbs].sort((a, b) => (b.clearance || 0) - (a.clearance || 0)).slice(0, 3)
            const avg  = Math.round(suburbs.reduce((s, r) => s + (r.clearance || 0), 0) / suburbs.length)
            return <>
              {`The inner ring recorded an average clearance rate of `}
              <span style={{ color: 'var(--gold-light)', fontFamily: 'monospace' }}>{avg}%</span>
              {` this week.`}
              {top3[0] ? ` ${top3[0].name} led at ${top3[0].clearance}%` : ''}
              {top3[1] ? `, followed by ${top3[1].name} at ${top3[1].clearance}%` : ''}
              {top3[2] ? ` and ${top3[2].name} at ${top3[2].clearance}%.` : '.'}
              {'\n\n'}
              <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>TOP SUBURBS BY CLEARANCE RATE:</span>
              {'\n'}
              {top3.map(s =>
                `• ${s.name}: Median ${s.median || '—'} · Clearance ${s.clearance || '—'}% · ${s.dom || '—'} days on market · ${s.change || '—'} quarterly\n`
              )}
            </>
          })()}
          {'\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'}
          <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Data: RECOMELB · recomelb-site.vercel.app · Not financial advice
          </span>
        </div>
      </section>

      {/* ── BUYER LEAD CAPTURE ────────────────────────────────────────────── */}
      <section className="suburb-strip" id="leads" style={{ background: 'var(--navy-dark)' }}>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Buyer lead capture</div>
            <h2 className="section-title">Buyers register here.<br />Leads go to you.</h2>
          </div>
        </div>
        <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
              Buyers submit their suburb preference, budget and timeline here. Leads are captured and matched to agents covering the relevant area — free during beta.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Pre-qualified with suburb, budget and timeline',
                'Delivered to your inbox the same day',
                'No fee during beta — free agent access',
              ].map(pt => (
                <div key={pt} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--gold)', marginTop: '1px' }}>→</span>{pt}
                </div>
              ))}
            </div>
          </div>

          {leadStatus === 'success' ? (
            <div style={{ color: '#4ade80', fontSize: '14px', padding: '28px', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.05)', lineHeight: '1.6' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', marginBottom: '8px' }}>You&apos;re on the list.</div>
              We&apos;ll match you with agents in {lead.suburb || 'your target suburb'} based on your budget and timeline.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Full name</label>
                <input className="email-input" style={{ width: '100%' }} placeholder="Jane Smith" value={lead.name} onChange={e => setLead(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email address</label>
                <input className="email-input" style={{ width: '100%' }} type="email" placeholder="jane@email.com" value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Target suburb</label>
                <select className="select-input" style={{ width: '100%' }} value={lead.suburb} onChange={e => setLead(p => ({ ...p, suburb: e.target.value }))}>
                  <option value="">— Select suburb —</option>
                  {suburbs.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="budget-timeline" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Budget range</label>
                  <select className="select-input" style={{ width: '100%' }} value={lead.budget} onChange={e => setLead(p => ({ ...p, budget: e.target.value }))}>
                    <option value="">— Select —</option>
                    {['Under $800k', '$800k–$1.2M', '$1.2M–$1.6M', '$1.6M–$2M', 'Over $2M'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Timeline</label>
                  <select className="select-input" style={{ width: '100%' }} value={lead.timeline} onChange={e => setLead(p => ({ ...p, timeline: e.target.value }))}>
                    <option value="">— Select —</option>
                    {['0–3 months', '3–6 months', '6–12 months'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ padding: '16px', marginTop: '4px', opacity: leadStatus === 'loading' ? 0.7 : 1 }}
                onClick={handleLeadSubmit}
                disabled={leadStatus === 'loading' || !lead.email}
              >
                {leadStatus === 'loading' ? 'Submitting…' : 'Register buyer interest'}
              </button>
              {leadStatus === 'error' && (
                <div style={{ color: '#f87171', fontSize: '13px' }}>{leadError}</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── COMMERCIAL VACANCY TRACKER ───────────────────────────────────── */}
      <section className="suburb-strip">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Commercial vacancy tracker · Inner Melbourne</div>
            <h2 className="section-title">Commercial market data.</h2>
          </div>
        </div>
        <table className="heat-table">
          <thead>
            <tr>
              <th>Precinct</th>
              <th>Asset class</th>
              <th>Vacancy rate</th>
              <th>Avg rent / m²</th>
              <th>Qtr change</th>
              <th>Net yield</th>
            </tr>
          </thead>
          <tbody>
            {commercial.map(row => (
              <tr key={row.name}>
                <td className="suburb-col">{row.name}</td>
                <td>
                  <span style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', border: '1px solid var(--navy-border)', color: 'var(--text-muted)' }}>
                    {row.type || '—'}
                  </span>
                </td>
                <td className="num-col">{row.vacancy || '—'}</td>
                <td className="num-col">{row.rent || '—'}</td>
                <td className="num-col" style={{ color: row.up !== false ? '#4ade80' : '#f87171' }}>
                  {row.change || '—'}
                </td>
                <td className="num-col">{row.yield || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
          Based on publicly available commercial leasing data, updated quarterly. Not financial advice.
        </p>
      </section>
    </>
  )
}
