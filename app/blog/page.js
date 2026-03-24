export const metadata = {
  title: 'News & Intelligence — RECOMELB',
}

export default function BlogPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="section-eyebrow">Intelligence · News & analysis</div>
        <h1 className="hero-headline" style={{fontSize:'clamp(38px,6vw,72px)', marginBottom:'24px'}}>
          Melbourne market<br /><em>intelligence, weekly.</em>
        </h1>
        <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:'1.7', marginBottom:'32px'}}>
          Auction results, suburb trends, commercial leasing updates and rate watch. In-depth articles launching soon.
        </p>
        <a href="/#subscribe" className="btn-primary">Get the weekly digest</a>
      </div>
    </div>
  )
}
