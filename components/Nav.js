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
          <li><Link href="/buyers">Buyers</Link></li>
          <li><Link href="/sellers">Sellers</Link></li>
          <li><Link href="/agents">Agents</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/about">Founder</Link></li>
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
        <Link href="/buyers" onClick={close}>Buyers</Link>
        <Link href="/sellers" onClick={close}>Sellers</Link>
        <Link href="/agents" onClick={close}>Agents</Link>
        <Link href="/blog" onClick={close}>Blog</Link>
        <Link href="/about" onClick={close}>Founder</Link>
        <Link href="/#subscribe" onClick={close}>Weekly digest</Link>
      </div>
    </>
  )
}
