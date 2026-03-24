'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo">RECO<span>MELB</span></Link>
        <ul className="nav-links">
          <li><Link href="/residential">Residential</Link></li>
          <li><Link href="/commercial">Commercial</Link></li>
          <li><Link href="/#deal-of-week">Deal of the week</Link></li>
          <li><Link href="/#for-you">For you</Link></li>
          <li><Link href="/blog">News</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
        <Link href="/#subscribe" className="nav-cta">Weekly digest</Link>
        <button
          className={`nav-hamburger${open ? ' open' : ''}`}
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`nav-dropdown${open ? ' open' : ''}`}>
        <Link href="/residential" onClick={close}>Residential</Link>
        <Link href="/commercial" onClick={close}>Commercial</Link>
        <Link href="/#deal-of-week" onClick={close}>Deal of the week</Link>
        <Link href="/#for-you" onClick={close}>For you</Link>
        <Link href="/blog" onClick={close}>News</Link>
        <Link href="/about" onClick={close}>About</Link>
        <Link href="/#subscribe" onClick={close}>Weekly digest</Link>
      </div>
    </>
  )
}
