'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ─── Slide types ────────────────────────────────────────────────────────────

type BookSlide = {
  type: 'series'
  title: string
  eyebrow?: string
  books: {
    number: string
    title: string
    amazonUrl: string | null
    available: boolean
    spineColor: string
    spineAccent: string
    textColor: string
    borderColor: string
  }[]
  viewHref: string
  viewLabel?: string
}

type InfoSlide = {
  type: 'info'
  title: string
  eyebrow?: string
  body: string
  linkHref?: string
  linkLabel?: string
  accentColor?: string
}

type Slide = BookSlide | InfoSlide

// ─── Slide data ──────────────────────────────────────────────────────────────
// Add new slides here. Each one becomes a full carousel panel.

const SLIDES: Slide[] = [
  {
    type: 'series',
    eyebrow: 'Now Available',
    title: 'The Polaenian Prophecies',
    books: [
      {
        number: 'I',
        title: 'Two Elven Sojourners',
        amazonUrl: 'https://www.amazon.com/dp/B0F3B9JSBF',
        available: true,
        spineColor: '#1a1a2e',
        spineAccent: '#d4af6a',
        textColor: '#d4af6a',
        borderColor: 'rgba(212,175,106,0.4)',
      },
      {
        number: 'II',
        title: 'Daughter of Ruin',
        amazonUrl: null,
        available: false,
        spineColor: '#2a0a0a',
        spineAccent: '#c44040',
        textColor: '#e08080',
        borderColor: 'rgba(196,64,64,0.4)',
      },
      {
        number: 'III',
        title: 'A New Era',
        amazonUrl: null,
        available: false,
        spineColor: '#0a1a0a',
        spineAccent: '#4a8a4a',
        textColor: '#80c080',
        borderColor: 'rgba(74,138,74,0.4)',
      },
    ],
    viewHref: '/series/tpp',
    viewLabel: 'View Full Series',
  },
  // Example info slide — remove or replace as needed
  // {
  //   type: 'info',
  //   eyebrow: 'Announcement',
  //   title: 'The Lore Compendium is Live',
  //   body: 'Explore hundreds of entries covering nations, races, holy beings, and more from the world of Nasariane.',
  //   linkHref: '/lore',
  //   linkLabel: 'Browse the Lore',
  //   accentColor: 'var(--gold-mid)',
  // },
]

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTOPLAY_MS = 5000

// ─── Sub-components ──────────────────────────────────────────────────────────

function ArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--gold-mid)'
        e.currentTarget.style.color = 'var(--gold-mid)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(212,175,106,0.25)'
        e.currentTarget.style.color = 'var(--gold-dim)'
      }}
      style={{
        background: 'none',
        border: '1px solid rgba(212,175,106,0.25)',
        color: 'var(--gold-dim)',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '4px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, color 0.2s',
        flexShrink: 0,
        fontFamily: 'serif',
        fontSize: '1.2rem',
        lineHeight: 1,
      }}
    >
      {direction === 'prev' ? '‹' : '›'}
    </button>
  )
}

function BookSpine({ book }: { book: BookSlide['books'][number] }) {
  const Wrapper = book.available ? 'a' : 'div'
  const wrapperProps = book.available
    ? { href: book.amazonUrl!, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="book-spine"
      style={{
        width: '130px',
        height: '200px',
        background: book.spineColor,
        border: `1px solid ${book.borderColor}`,
        borderTop: `3px solid ${book.spineAccent}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0.85rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        opacity: book.available ? 1 : 0.55,
        cursor: book.available ? 'pointer' : 'default',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      <span style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.6rem',
        letterSpacing: '0.15em',
        color: book.spineAccent,
        opacity: 0.7,
      }}>
        BOOK {book.number}
      </span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '20px', height: '1px', background: book.spineAccent, margin: '0 auto', opacity: 0.5 }} />
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.72rem',
          letterSpacing: '0.06em',
          color: book.textColor,
          lineHeight: 1.4,
          marginTop: '0.4rem',
          marginBottom: '0.4rem',
        }}>
          {book.title}
        </div>
        <div style={{ width: '20px', height: '1px', background: book.spineAccent, margin: '0 auto', opacity: 0.5 }} />
      </div>
      <span style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.5rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: book.available ? book.spineAccent : 'rgba(255,255,255,0.2)',
      }}>
        {book.available ? 'Available' : 'Coming Soon'}
      </span>
    </Wrapper>
  )
}

function SeriesSlide({ slide }: { slide: BookSlide }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      {/* Heading */}
      <div style={{ textAlign: 'center' }}>
        {slide.eyebrow && (
          <h4 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold-dim)',
            marginBottom: '0.4rem',
          }}>
            {slide.eyebrow}
          </h4>
        )}
        <h2 className="ornamented-heading" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', display: 'inline-block' }}>
          {slide.title}
        </h2>
      </div>

      {/* Book spines */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
        {slide.books.map(book => <BookSpine key={book.number} book={book} />)}
      </div>

      {/* View link */}
      <Link href={slide.viewHref} className="cta-btn">
        {slide.viewLabel ?? 'View Series'}
      </Link>
    </div>
  )
}

function InfoSlidePanel({ slide }: { slide: InfoSlide }) {
  const accent = slide.accentColor ?? 'var(--gold-mid)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '560px', textAlign: 'center' }}>
      {slide.eyebrow && (
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--gold-dim)',
        }}>
          {slide.eyebrow}
        </p>
      )}
      <h3 style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(1rem, 2vw, 1.4rem)',
        color: accent,
        letterSpacing: '0.06em',
        fontWeight: 600,
      }}>
        {slide.title}
      </h3>
      <div style={{ width: '32px', height: '1px', background: accent, opacity: 0.5 }} />
      <p style={{
        fontFamily: "'Crimson Text', serif",
        fontSize: '1.05rem',
        color: 'var(--cream-dim)',
        lineHeight: 1.75,
      }}>
        {slide.body}
      </p>
      {slide.linkHref && (
        <Link
          href={slide.linkHref}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '0.65rem 1.75rem',
            border: `1px solid rgba(212,175,106,0.3)`,
            color: 'var(--cream-muted)',
            textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = accent
            e.currentTarget.style.color = accent
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(212,175,106,0.3)'
            e.currentTarget.style.color = 'var(--cream-muted)'
          }}
        >
          {slide.linkLabel ?? 'Learn More'}
        </Link>
      )}
    </div>
  )
}

// ─── Main carousel ───────────────────────────────────────────────────────────

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() =>
    setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), [])

  const next = useCallback(() =>
    setCurrent(c => (c + 1) % SLIDES.length), [])

  useEffect(() => {
    if (paused || SLIDES.length <= 1) return
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = SLIDES[current]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}
    >
      {/* Arrows + slide content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%', justifyContent: 'center' }}>
        <ArrowButton direction="prev" onClick={prev} />

        {/* Slide panel */}
        <div style={{ flex: '0 1 640px', display: 'flex', justifyContent: 'center' }}>
          {slide.type === 'series'
            ? <SeriesSlide slide={slide} />
            : <InfoSlidePanel slide={slide} />
          }
        </div>

        <ArrowButton direction="next" onClick={next} />
      </div>

      {/* Dot indicators — only render if more than one slide */}
      {SLIDES.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                background: i === current ? 'var(--gold-mid)' : 'rgba(212,175,106,0.25)',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}