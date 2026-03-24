export const metadata = {
  title: 'For Agents — RECOMELB',
}

export default function AgentsPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="section-eyebrow">For agents · Real estate professionals</div>
        <h1 className="hero-headline" style={{fontSize:'clamp(38px,6vw,72px)', marginBottom:'24px'}}>
          Your weekly market prep,<br /><em>already done.</em>
        </h1>
        <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:'1.7', marginBottom:'32px'}}>
          Shareable suburb reports, appraisal data support, buyer leads and weekly client summaries. Agent tools launching soon.
        </p>
        <a href="/#subscribe" className="btn-primary">Get early agent access</a>
      </div>
    </div>
  )
}
