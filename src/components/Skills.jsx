/**
 * Skills.jsx
 * ─────────────────────────────────────────────────────────────────
 * Two-row continuous scrolling marquee (one LTR, one RTL)
 * + a static grid of categorised skill badges below.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MARQUEE_ROW_1 = [
  'Node.js', 'React.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript',
  'REST APIs', 'JavaFX', 'Java', 'MERN Stack', 'Git & GitHub', 'Chrome APIs',
]
const MARQUEE_ROW_2 = [
  'C++', 'Python', 'SQL Server', 'OOP', 'Data Structures', 'Algorithms',
  'Software QA', 'Bug Tracking', 'Linux', 'Lenis', 'GSAP', 'n8n',
]

const SKILL_CATEGORIES = [
  {
    cat: 'Languages',
    skills: ['C++', 'Java', 'JavaScript', 'Python'],
  },
  {
    cat: 'Backend',
    skills: ['Node.js', 'Express.js', 'REST API Design', 'Java Backend'],
  },
  {
    cat: 'Frontend',
    skills: ['React.js', 'JavaFX', 'HTML5', 'CSS3'],
  },
  {
    cat: 'Databases',
    skills: ['MongoDB', 'Microsoft SQL Server', 'SSMS', 'Schema Design'],
  },
  {
    cat: 'QA & Testing',
    skills: ['SQA Principles', 'Bug Tracking', 'Edge Case Testing', 'Bug Hunting'],
  },
  {
    cat: 'Tools',
    skills: ['Git', 'GitHub', 'Chrome Extension APIs', 'n8n (Exploratory)', 'Linux', 'Windows 11'],
  },
]

/* Duplicate items for seamless loop */
const loop = (arr) => [...arr, ...arr, ...arr]

export default function Skills() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.skills-label',
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      gsap.fromTo('.skill-cat-block',
        { yPercent: 20, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.skill-cats', start: 'top 80%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        padding: 'clamp(6rem, 12vw, 12rem) 0',
        borderTop: '1px solid #1a1a1a',
        overflow: 'hidden',
      }}
    >
      {/* Section label — padded */}
      <div
        className="skills-label"
        style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
      >
        <span className="section-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
          04 — Tech Stack
        </span>
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          letterSpacing: '-0.03em',
          color: '#F5F0E8',
          lineHeight: 1,
          maxWidth: '1400px',
        }}>
          Tools of the<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1px #444' }}>Trade</span>
        </h2>
      </div>

      {/* ── Marquee Row 1 (LTR) ── */}
      <div
        style={{
          overflow: 'hidden',
          borderTop: '1px solid #1a1a1a',
          borderBottom: '1px solid #1a1a1a',
          padding: '1rem 0',
          marginBottom: '1px',
        }}
      >
        <div className="marquee-track-ltr" style={{ display: 'flex', gap: '2rem', width: 'max-content' }}>
          {loop(MARQUEE_ROW_1).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <span style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                letterSpacing: '-0.02em',
                color: '#F5F0E8',
                whiteSpace: 'nowrap',
              }}>
                {item}
              </span>
              <span style={{ color: '#C8FF4E', fontSize: '0.5rem' }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Marquee Row 2 (RTL) ── */}
      <div
        style={{
          overflow: 'hidden',
          borderBottom: '1px solid #1a1a1a',
          padding: '1rem 0',
          marginBottom: 'clamp(4rem, 8vw, 7rem)',
        }}
      >
        <div className="marquee-track-rtl" style={{ display: 'flex', gap: '2rem', width: 'max-content' }}>
          {loop(MARQUEE_ROW_2).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <span style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                letterSpacing: '-0.02em',
                color: 'transparent',
                WebkitTextStroke: '1px #333',
                whiteSpace: 'nowrap',
              }}>
                {item}
              </span>
              <span style={{ color: '#333', fontSize: '0.5rem' }}>◇</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Skill category grid ── */}
      <div
        className="skill-cats"
        style={{
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
        }}
      >
        {SKILL_CATEGORIES.map(({ cat, skills }) => (
          <div key={cat} className="skill-cat-block">
            <div style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C8FF4E',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #1a1a1a',
            }}>
              {cat}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="skill-badge"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '4px',
                    height: '4px',
                    background: '#333',
                    borderRadius: '50%',
                    flexShrink: 0,
                    transition: 'background 0.3s ease',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#C8FF4E'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#333'}
                  />
                  <span style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '0.75rem',
                    color: '#888',
                    transition: 'color 0.3s ease',
                  }}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
