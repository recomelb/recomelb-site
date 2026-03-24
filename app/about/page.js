export const metadata = {
  title: 'About — RECOMELB',
}

export default function AboutPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon-inner">
        <div className="section-eyebrow">About · The person behind it</div>
        <h1 className="hero-headline" style={{fontSize:'clamp(38px,6vw,72px)', marginBottom:'24px'}}>
          Built in Melbourne,<br /><em>for Melbourne.</em>
        </h1>
        <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:'1.7', marginBottom:'32px'}}>
          RECOMELB was built by Adi Agarwal — a data-driven approach to making Melbourne&apos;s property market legible for buyers, sellers and agents. Full about page coming soon.
        </p>
        <a href="/#subscribe" className="btn-primary">Follow our journey</a>
      </div>
    </div>
  )
}
