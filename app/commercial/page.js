export const metadata = {
  title: 'Commercial — RECOMELB',
}

export default function CommercialPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="section-eyebrow">Commercial · Inner Melbourne</div>
        <h1 className="hero-headline" style={{fontSize:'clamp(38px,6vw,72px)', marginBottom:'24px'}}>
          Melbourne&apos;s commercial<br />market, <em>coming soon.</em>
        </h1>
        <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:'1.7', marginBottom:'32px'}}>
          Office, retail and industrial market intelligence across Melbourne&apos;s inner precincts. Vacancy rates, yields and leasing activity. Launching soon.
        </p>
        <a href="/#subscribe" className="btn-primary">Get notified when we launch</a>
      </div>
    </div>
  )
}
