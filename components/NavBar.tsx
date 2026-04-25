'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/series/tpp', label: 'Series' },
  { href: '/lore', label: 'Lore' },
  { href: '/map', label: 'Map' },
  { href: '/about', label: 'About' },
]

export default function NavBar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <header className="site-nav">
          <div className="page-container">
            <nav className="nav-inner">
              {/* Wordmark */}
              <Link href="/" className="nav-wordmark">
                TPP Books
              </Link>

              {/* Hamburger button — only visible on mobile via CSS */}
              <button
                className="nav-hamburger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation"
                aria-expanded={isOpen}
              >
                <span /><span /><span />
              </button>

              {/* Nav links */}
              <ul className={`nav-links${isOpen ? ' open' : ''}`}>
                {NAV_LINKS.map(({ href, label }) => {
                    const isActive = href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(href)

                    return (
                        <li key={href}>
                            <Link
                              href={href}
                              className={isActive ? 'nav-link nav-link-active' : 'nav-link'}
                              onClick={() => setIsOpen(false)}
                            >
                                {label}
                            </Link>
                        </li>
                    )
                })}
              </ul>
            </nav>
          </div>
        </header>
    )
}