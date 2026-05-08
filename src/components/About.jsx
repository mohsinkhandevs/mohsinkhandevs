/**
 * About.jsx
 * ─────────────────────────────────────────────────────────────────
 * Bio section with sentence-by-sentence word highlight on scroll.
 * Uses GSAP ScrollTrigger to progressively illuminate words as
 * they enter the viewport — creating a "reading along" effect.
 *
 * Layout:
 *   Left col  — section label + stats
 *   Right col — large illuminated bio text
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BIO = `I'm a 4th-semester Software Engineering student at FAST NUCES, Islamabad, building real products while still in school. I'm passionate about backend architecture, database design, and software quality assurance — not just writing code, but engineering systems that actually work. I've shipped full-stack web apps with the MERN stack, desktop logistics platforms in Java, and browser extensions with raw JavaScript. Right now I'm looking for a backend or QA internship where I can bring sharp problem-solving and obsessive attention to detail to a real engineering team.`

const STATS = [
  { value: '4th',     label: 'Semester'         },
  { value: '3+',      label: 'Shipped Projects'  },
  { value: 'FAST',    label: 'NUCES Islamabad'   },
  { value: '∞',       label: 'LeetCode Problems' },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Word-highlight scroll effect ── */
      const words = sectionRef.current.querySelectorAll('.about-word')

      gsap.to(words, {
        color: '#F5F0E8',
        stagger: 0.03,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 1.5,
        },
      })

      /* ── Section label fade up ── */
      gsap.fromTo('.about-label',
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      /* ── Stats stagger ── */
      gsap.fromTo('.about-stat',
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%',
          },
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* Split bio into word spans */
  const words = BIO.split(' ').map((word, i) => (
    <span key={i}>
      <span className="about-word" style={{ color: '#2a2a2a' }}>
        {word}
      </span>
      {i < BIO.split(' ').length - 1 ? ' ' : ''}
    </span>
  ))

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 4rem)',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 'clamp(3rem, 6vw, 8rem)',
        alignItems: 'start',
      }}>

        {/* ── Left: label + stats ── */}
        <div style={{ position: 'sticky', top: '8rem' }}>
          <div className="about-label" style={{ marginBottom: '3rem' }}>
            <span className="section-label">02 — About</span>
          </div>

          <div className="about-stats" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {STATS.map(({ value, label }, i) => (
              <div key={i} className="about-stat" style={{ borderLeft: '1px solid #222', paddingLeft: '1rem' }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  color: '#C8FF4E',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}>
                  {value}
                </div>
                <div style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#444',
                  marginTop: '0.25rem',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: illuminated bio ── */}
        <div>
          <p style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(1.3rem, 3vw, 2.2rem)',
            lineHeight: 1.45,
            letterSpacing: '-0.02em',
          }}>
            {words}
          </p>

          {/* Education block */}
          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            border: '1px solid #1a1a1a',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
          }}>
            {[
              { label: 'Degree',      value: 'B.S. Software Engineering' },
              { label: 'University',  value: 'FAST NUCES Islamabad'       },
              { label: 'Expected',    value: '2028'                        },
              { label: 'Focus',       value: 'Backend · QA · Architecture' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#444',
                  marginBottom: '0.4rem',
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.8rem',
                  color: '#F5F0E8',
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
