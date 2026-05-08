/**
 * Hero.jsx
 * ─────────────────────────────────────────────────────────────────
 * Entrance animation sequence (orchestrated by GSAP):
 *
 * 1. Loader wipe — full-screen black panel splits open vertically
 * 2. Name reveal — chars animate up from below with a clip mask
 * 3. Role line   — slides in from left with opacity
 * 4. Meta info   — staggered fade-up (location, year, status)
 * 5. CTA button  — scale in with elastic easing
 * 6. Scroll indicator — infinite bob animation
 * 7. Background noise grid — subtle parallax on mouse move
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLenis } from './SmoothScroll'

/* ── helpers ── */
const splitChars = (text) =>
  text.split('').map((char, i) => (
    <span
      key={i}
      className="hero-char inline-block"
      style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))

export default function Hero({ onLoaded }) {
  const loaderRef    = useRef(null)
  const loaderTopRef = useRef(null)
  const loaderBotRef = useRef(null)
  const heroRef      = useRef(null)
  const { scrollTo } = useLenis() || {}

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onLoaded?.()
        },
      })

      /* 0. Set initial states */
      gsap.set('.hero-char',       { yPercent: 120, opacity: 0 })
      gsap.set('.hero-role',       { xPercent: -5, opacity: 0 })
      gsap.set('.hero-meta-item',  { yPercent: 30, opacity: 0 })
      gsap.set('.hero-cta',        { scale: 0.85, opacity: 0 })
      gsap.set('.hero-scroll-ind', { opacity: 0 })
      gsap.set('.hero-line',       { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.hero-noise-grid', { opacity: 0 })

      /* 1. Loader split open */
      tl.to([loaderTopRef.current, loaderBotRef.current], {
        yPercent: (i) => (i === 0 ? -100 : 100),
        duration: 1.1,
        ease: 'power4.inOut',
        delay: 0.6,
      })
        .to(loaderRef.current, { autoAlpha: 0, duration: 0.1 }, '-=0.1')

      /* 2. Background grid */
        .to('.hero-noise-grid', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')

      /* 3. Name characters */
        .to('.hero-char', {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.03,
        }, '-=0.5')

      /* 4. Role line */
        .to('.hero-role', {
          xPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        }, '-=0.55')

      /* 5. Divider line */
        .to('.hero-line', {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        }, '-=0.5')

      /* 6. Meta items */
        .to('.hero-meta-item', {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
        }, '-=0.5')

      /* 7. CTA */
        .to('.hero-cta', {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.4)',
        }, '-=0.4')

      /* 8. Scroll indicator */
        .to('.hero-scroll-ind', {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
        }, '-=0.3')

    }, heroRef)

    return () => ctx.revert()
  }, [onLoaded])

  /* ── Mouse parallax on background grid ── */
  useEffect(() => {
    const grid = document.querySelector('.hero-noise-grid')
    if (!grid) return

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      gsap.to(grid, { x, y, duration: 1.6, ease: 'power1.out' })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* ── Scroll indicator bob ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-scroll-arrow', {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: 'sine.inOut',
        delay: 2.5,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ── Loader ── */}
      <div ref={loaderRef} style={{ position: 'fixed', inset: 0, zIndex: 99998, pointerEvents: 'none' }}>
        <div
          ref={loaderTopRef}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '50%',
            background: '#080808',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '1rem',
          }}
        >
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#333',
          }}>
            MK ↗ 2026
          </span>
        </div>
        <div
          ref={loaderBotRef}
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '50%',
            background: '#080808',
          }}
        />
        {/* Lime accent line at split */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: '#C8FF4E',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }} />
      </div>

      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        id="hero"
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(1.5rem, 5vw, 4rem)',
          paddingBottom: 'clamp(2rem, 6vw, 5rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Background noise grid ── */}
        <div
          className="hero-noise-grid"
          style={{
            position: 'absolute',
            inset: '-10%',
            zIndex: 0,
            backgroundImage: `
              linear-gradient(rgba(200,255,78,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,255,78,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            willChange: 'transform',
          }}
        />

        {/* ── Top-right corner badge ── */}
        <div style={{
          position: 'absolute',
          top: 'clamp(1.5rem, 5vw, 4rem)',
          right: 'clamp(1.5rem, 5vw, 4rem)',
          zIndex: 2,
          textAlign: 'right',
        }}>
          <div className="hero-meta-item" style={{ overflow: 'hidden' }}>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#444',
            }}>
              Available for Internship
            </span>
          </div>
          <div className="hero-meta-item" style={{ marginTop: '0.25rem', overflow: 'hidden' }}>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C8FF4E',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              justifyContent: 'flex-end',
            }}>
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#C8FF4E',
                animation: 'pulse-dot 2s infinite',
              }} />
              Open to Work
            </span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px' }}>

          {/* Section label */}
          <div className="hero-meta-item" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
            <span className="section-label">
              ↗ Portfolio — 2026
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              overflow: 'hidden',
              lineHeight: 0.9,
              marginBottom: '0.5rem',
            }}
          >
            <h1
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(3.5rem, 12vw, 13rem)',
                letterSpacing: '-0.03em',
                color: '#F5F0E8',
                lineHeight: 0.9,
                display: 'block',
              }}
              aria-label="Mohsin Khan"
            >
              {splitChars('MOHSIN')}
            </h1>
          </div>

          <div style={{ overflow: 'hidden', lineHeight: 0.9, marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(3.5rem, 12vw, 13rem)',
                letterSpacing: '-0.03em',
                color: 'transparent',
                WebkitTextStroke: '1px #C8FF4E',
                lineHeight: 0.9,
                display: 'block',
              }}
              aria-label="Khan"
            >
              {splitChars('KHAN')}
            </h1>
          </div>

          {/* Divider line */}
          <div
            className="hero-line"
            style={{
              height: '1px',
              background: '#222222',
              marginBottom: '1.5rem',
            }}
          />

          {/* Bottom row: role + meta + cta */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}>

            {/* Role */}
            <div>
              <p className="hero-role" style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                letterSpacing: '0.08em',
                color: '#888',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}>
                Software Engineer — Backend & Full-Stack
              </p>
              <p className="hero-role" style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
                letterSpacing: '0.1em',
                color: '#444',
                textTransform: 'uppercase',
              }}>
                FAST NUCES, Islamabad — 4th Semester
              </p>
            </div>

            {/* CTA button */}
            <a
              href="#works"
              className="hero-cta magnetic-btn"
              data-cursor-label="View"
              onClick={(e) => {
                e.preventDefault()
                scrollTo?.('#works')
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                border: '1px solid #C8FF4E',
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C8FF4E',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget.querySelector('.btn-fill'), {
                  yPercent: 0,
                  duration: 0.35,
                  ease: 'power2.inOut',
                })
                gsap.to(e.currentTarget.querySelector('.btn-text'), {
                  color: '#080808',
                  duration: 0.35,
                })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget.querySelector('.btn-fill'), {
                  yPercent: 100,
                  duration: 0.35,
                  ease: 'power2.inOut',
                })
                gsap.to(e.currentTarget.querySelector('.btn-text'), {
                  color: '#C8FF4E',
                  duration: 0.35,
                })
              }}
            >
              {/* Fill bg */}
              <span
                className="btn-fill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#C8FF4E',
                  transform: 'translateY(100%)',
                  zIndex: 0,
                }}
              />
              <span className="btn-text" style={{ position: 'relative', zIndex: 1, color: '#C8FF4E' }}>
                Selected Works
              </span>
              <span style={{ position: 'relative', zIndex: 1 }}>↗</span>
            </a>
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <div
          className="hero-scroll-ind"
          style={{
            position: 'absolute',
            bottom: 'clamp(1.5rem, 4vw, 3rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 2,
          }}
        >
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#333',
          }}>
            Scroll
          </span>
          <div
            className="hero-scroll-arrow"
            style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, #C8FF4E, transparent)',
            }}
          />
        </div>
      </section>

      {/* Pulse dot animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.6); }
        }
      `}</style>
    </>
  )
}
