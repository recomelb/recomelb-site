export const metadata = {
  title: 'For Buyers — RECOMELB',
}

export default function BuyersPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="section-eyebrow">For buyers · Property seekers</div>
        <h1 className="hero-headline" style={{fontSize:'clamp(38px,6vw,72px)', marginBottom:'24px'}}>
          Find the opportunity<br /><em>before everyone else.</em>
        </h1>
        <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:'1.7', marginBottom:'32px'}}>
          Undervalued properties, suburb trends and market intelligence to help you buy smarter. Dedicated buyer tools launching soon.
        </p>
        <a href="/#subscribe" className="btn-primary">Get notified when we launch</a>
      </div>
    </div>
  )
}
