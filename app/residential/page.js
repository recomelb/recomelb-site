export const metadata = {
  title: 'Residential — RECOMELB',
}

export default function ResidentialPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="section-eyebrow">Residential · Inner ring</div>
        <h1 className="hero-headline" style={{fontSize:'clamp(38px,6vw,72px)', marginBottom:'24px'}}>
          Melbourne&apos;s residential<br />market, <em>coming soon.</em>
        </h1>
        <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:'1.7', marginBottom:'32px'}}>
          Deep-dive suburb data, auction results, clearance rates and market intelligence for Melbourne&apos;s inner ring. Launching soon.
        </p>
        <a href="/#subscribe" className="btn-primary">Get notified when we launch</a>
      </div>
    </div>
  )
}
