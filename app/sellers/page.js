export const metadata = {
  title: 'For Sellers — RECOMELB',
}

export default function SellersPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="section-eyebrow">For sellers · Vendors</div>
        <h1 className="hero-headline" style={{fontSize:'clamp(38px,6vw,72px)', marginBottom:'24px'}}>
          Know your market<br /><em>before you list.</em>
        </h1>
        <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:'1.7', marginBottom:'32px'}}>
          Comparable sales, clearance rates and suburb momentum to help you price, time and position your property. Seller tools launching soon.
        </p>
        <a href="/#subscribe" className="btn-primary">Get notified when we launch</a>
      </div>
    </div>
  )
}
