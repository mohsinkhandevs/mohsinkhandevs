/**
 * Contact.jsx
 * ─────────────────────────────────────────────────────────────────
 * Footer / contact section:
 *
 * • Giant animated "LET'S TALK" heading with scroll reveal
 * • Magnetic social/contact links with hover underline animation
 * • Availability status badge
 * • Copyright footer strip
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'mohsinkhan.devs@gmail.com',
    href: 'mailto:mohsinkhan.devs@gmail.com',
    arrow: '↗',
  },
  {
    label: 'GitHub',
    value: 'github.com/Mohsin-Khan-Dev',
    href: 'https://github.com/Mohsin-Khan-Dev',
    arrow: '↗',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/mohsin-khan-dev',
    href: 'https://linkedin.com/in/mohsin-khan-dev',
    arrow: '↗',
  },
  {
    label: 'Phone',
    value: '+92 300 0920513',
    href: 'tel:+923000920513',
    arrow: '→',
  },
]

export default function Contact() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Heading chars reveal */
      gsap.fromTo('.contact-char',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      /* Sub line */
      gsap.fromTo('.contact-sub',
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
          delay: 0.3,
        }
      )

      /* Contact links */
      gsap.fromTo('.contact-link-item',
        { xPercent: -10, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.contact-links-grid',
            start: 'top 80%',
          },
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* Magnetic link hover */
  const handleMagnet = (e) => {
    const el   = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x    = (e.clientX - rect.left - rect.width  / 2) * 0.25
    const y    = (e.clientY - rect.top  - rect.height / 2) * 0.25
    gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' })
  }

  const handleMagnetLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  /* Split heading into chars */
  const heading = "LET'S TALK"
  const chars = heading.split('').map((char, i) => (
    <span
      key={i}
      className="contact-char"
      style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 4rem)',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Section label */}
        <div className="contact-sub" style={{ marginBottom: '2rem' }}>
          <span className="section-label">05 — Contact</span>
        </div>

        {/* Giant heading */}
        <div style={{ overflow: 'hidden', marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(3.5rem, 14vw, 15rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            color: '#F5F0E8',
            display: 'block',
          }}>
            {chars}
          </h2>
        </div>

        {/* Sub copy */}
        <p className="contact-sub" style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
          color: '#555',
          maxWidth: '500px',
          lineHeight: 1.7,
          marginBottom: 'clamp(3rem, 7vw, 6rem)',
        }}>
          Currently seeking a backend or QA internship. Available for freelance projects, collaborations, and interesting engineering problems.
        </p>

        {/* Availability badge */}
        <div className="contact-sub" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.6rem 1.25rem',
          border: '1px solid rgba(200,255,78,0.3)',
          marginBottom: 'clamp(3rem, 7vw, 6rem)',
          background: 'rgba(200,255,78,0.05)',
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#C8FF4E',
            animation: 'pulse-dot 2s infinite',
          }} />
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C8FF4E',
          }}>
            Available for Internship — 2026/2027
          </span>
        </div>

        {/* Contact links grid */}
        <div
          className="contact-links-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0',
            borderTop: '1px solid #1a1a1a',
          }}
        >
          {CONTACT_LINKS.map(({ label, value, href, arrow }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="contact-link-item magnetic-btn"
              data-cursor-label={arrow}
              onMouseMove={handleMagnet}
              style={{
                display: 'block',
                padding: '2rem',
                borderRight: '1px solid #1a1a1a',
                borderBottom: '1px solid #1a1a1a',
                textDecoration: 'none',
                transition: 'background 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(200,255,78,0.03)'
                gsap.to(e.currentTarget.querySelector('.clink-arrow'), {
                  x: 6,
                  y: -6,
                  duration: 0.3,
                  ease: 'power2.out',
                })
                gsap.to(e.currentTarget.querySelector('.clink-value'), {
                  color: '#C8FF4E',
                  duration: 0.3,
                })
              }}
              onMouseLeave={(e) => {
                handleMagnetLeave(e);
                e.currentTarget.style.background = 'transparent'
                gsap.to(e.currentTarget.querySelector('.clink-arrow'), {
                  x: 0,
                  y: 0,
                  duration: 0.4,
                  ease: 'elastic.out(1, 0.5)',
                })
                gsap.to(e.currentTarget.querySelector('.clink-value'), {
                  color: '#F5F0E8',
                  duration: 0.3,
                })
              }}
            >
              <div style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#444',
                marginBottom: '0.75rem',
              }}>
                {label}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}>
                <span
                  className="clink-value"
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                    color: '#F5F0E8',
                    transition: 'color 0.3s ease',
                    wordBreak: 'break-all',
                  }}
                >
                  {value}
                </span>
                <span
                  className="clink-arrow"
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '1rem',
                    color: '#C8FF4E',
                    flexShrink: 0,
                  }}
                >
                  {arrow}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* ── Footer strip ── */}
        <div style={{
          marginTop: 'clamp(4rem, 8vw, 7rem)',
          paddingTop: '2rem',
          borderTop: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            color: '#333',
            textTransform: 'uppercase',
          }}>
            © 2026 Mohsin Khan — All rights reserved
          </span>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Islamabad, PK', 'Available Remotely', 'B.S. SE @ FAST NUCES'].map((item) => (
              <span key={item} style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                color: '#2a2a2a',
                textTransform: 'uppercase',
              }}>
                {item}
              </span>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0 })}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C8FF4E',
              background: 'none',
              border: '1px solid rgba(200,255,78,0.3)',
              padding: '0.4rem 0.9rem',
              cursor: 'none',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(200,255,78,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ↑ Top
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.6); }
        }
      `}</style>
    </section>
  )
}
