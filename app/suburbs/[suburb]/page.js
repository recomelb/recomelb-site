export async function generateMetadata({ params }) {
  const name = params.suburb.charAt(0).toUpperCase() + params.suburb.slice(1).replace(/-/g, ' ')
  return { title: `${name} — RECOMELB` }
}

export default function SuburbPage({ params }) {
  const name = params.suburb.charAt(0).toUpperCase() + params.suburb.slice(1).replace(/-/g, ' ')

  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="section-eyebrow">Suburb profile · Inner Melbourne</div>
        <h1 className="hero-headline" style={{fontSize:'clamp(38px,6vw,72px)', marginBottom:'24px'}}>
          {name},<br /><em>coming soon.</em>
        </h1>
        <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:'1.7', marginBottom:'32px'}}>
          Detailed market data, auction history, clearance rates and price trends for {name}. Full suburb profiles launching soon.
        </p>
        <a href="/#subscribe" className="btn-primary">Get notified when we launch</a>
      </div>
    </div>
  )
}
