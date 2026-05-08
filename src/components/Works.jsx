/**
 * Works.jsx
 * ─────────────────────────────────────────────────────────────────
 * Project showcase section:
 *
 * • Full-width list items, each with hover state
 * • On hover: project number, title, and tags illuminate
 * • Floating image preview follows cursor (offset) on hover
 * • Magnetic CTA buttons
 * • Scroll-triggered entrance per item
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: '01',
    title: 'Lost & Found System',
    subtitle: 'University web platform to report & locate missing items.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    type: 'Full-Stack Web App',
    period: 'Fall 2026',
    color: '#C8FF4E',
    description:
      'Built a fully functional university Lost & Found platform using the MERN stack. Designed RESTful APIs for inventory creation, updates, and querying. Implemented searchable, filterable database records for students and staff.',
    links: {
      github: 'https://github.com/Mohsin-Khan-Dev',
    },
    // Placeholder gradient "image" for the preview card
    gradient: 'linear-gradient(135deg, #0f1a0a 0%, #1a2d0d 50%, #0a1a0a 100%)',
    accentPattern: true,
  },
  {
    id: '02',
    title: 'Routex',
    subtitle: 'Desktop logistics & fleet management system.',
    tags: ['Java', 'JavaFX', 'SQL Server', 'SSMS'],
    type: 'Desktop Application',
    period: 'Spring 2026',
    color: '#4EAAFF',
    description:
      'Desktop-based logistics tracking system built with Java and JavaFX. Manages vehicle routes, driver details, and delivery logs in a relational Microsoft SQL Server database. Real-time data retrieval with custom Java SQL query logic.',
    links: {
      github: 'https://github.com/Mohsin-Khan-Dev',
    },
    gradient: 'linear-gradient(135deg, #0a0f1a 0%, #0d1a2d 50%, #0a0f1a 100%)',
    accentPattern: true,
  },
  {
    id: '03',
    title: 'GClass Downloader',
    subtitle: 'Chrome extension for batch course-material downloads.',
    tags: ['JavaScript', 'Chrome APIs', 'DOM', 'QA'],
    type: 'Browser Extension',
    period: 'Spring 2026',
    color: '#FF6B4E',
    description:
      'Custom Chrome extension automating batch downloads from Google Classroom. Leverages Chrome Web APIs and DOM manipulation to extract file links. Actively QA-tested for edge cases prior to Chrome Web Store release.',
    links: {
      github: 'https://github.com/Mohsin-Khan-Dev',
    },
    gradient: 'linear-gradient(135deg, #1a0f0a 0%, #2d1a0d 50%, #1a0f0a 100%)',
    accentPattern: true,
  },
]

export default function Works() {
  const sectionRef   = useRef(null)
  const previewRef   = useRef(null)
  const [activeIdx, setActiveIdx] = useState(null)

  /* Preview image follows cursor */
  useEffect(() => {
    const onMove = (e) => {
      if (!previewRef.current) return
      gsap.to(previewRef.current, {
        x: e.clientX + 24,
        y: e.clientY - 60,
        duration: 0.55,
        ease: 'power2.out',
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* Scroll-triggered entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo('.works-label',
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      gsap.fromTo('.work-item',
        { yPercent: 20, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.works-list',
            start: 'top 80%',
          },
        }
      )

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* Magnetic button effect */
  const handleMagnet = (e, strength = 0.35) => {
    const btn  = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) * strength
    const dy   = (e.clientY - cy) * strength
    gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' })
  }

  const handleMagnetLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <section
      ref={sectionRef}
      id="works"
      style={{
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 4rem)',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div className="works-label">
            <span className="section-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
              03 — Selected Works
            </span>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              letterSpacing: '-0.03em',
              color: '#F5F0E8',
              lineHeight: 1,
            }}>
              Things I've<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1px #444' }}>Built</span>
            </h2>
          </div>
          <div className="works-label">
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#444',
            }}>
              {PROJECTS.length} Projects
            </span>
          </div>
        </div>

        {/* Projects list */}
        <div className="works-list">
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className="work-item"
              style={{
                borderTop: '1px solid #1a1a1a',
                padding: 'clamp(1.5rem, 3vw, 2.5rem) 0',
                cursor: 'none',
              }}
              onMouseEnter={() => {
                setActiveIdx(i)
                gsap.to(previewRef.current, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
              }}
              onMouseLeave={() => {
                setActiveIdx(null)
                gsap.to(previewRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' })
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '4rem 1fr auto',
                gap: '2rem',
                alignItems: 'center',
              }}>

                {/* Number */}
                <span style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  color: activeIdx === i ? project.color : '#333',
                  transition: 'color 0.3s ease',
                }}>
                  {project.id}
                </span>

                {/* Title + meta */}
                <div>
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: 'clamp(1.3rem, 3.5vw, 2.8rem)',
                    letterSpacing: '-0.03em',
                    color: activeIdx === i ? '#F5F0E8' : '#555',
                    transition: 'color 0.3s ease',
                    lineHeight: 1.1,
                    marginBottom: '0.5rem',
                  }}>
                    {project.title}
                  </h3>
                  <p style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '0.75rem',
                    color: activeIdx === i ? '#888' : '#333',
                    transition: 'color 0.3s ease',
                    marginBottom: '0.75rem',
                  }}>
                    {project.subtitle}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '0.6rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.6rem',
                          border: `1px solid ${activeIdx === i ? project.color + '55' : '#1a1a1a'}`,
                          color: activeIdx === i ? project.color : '#444',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#333',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}>
                    {project.period}
                  </span>
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic-btn"
                    data-cursor-label="Open"
                    onMouseMove={handleMagnet}
                    onMouseLeave={handleMagnetLeave}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '0.65rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: activeIdx === i ? project.color : '#444',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      border: `1px solid ${activeIdx === i ? project.color + '44' : '#1a1a1a'}`,
                      padding: '0.5rem 1rem',
                    }}
                  >
                    View ↗
                  </a>
                </div>
              </div>

              {/* Expanded description on hover */}
              <div style={{
                overflow: 'hidden',
                maxHeight: activeIdx === i ? '100px' : '0px',
                transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                marginTop: activeIdx === i ? '1.5rem' : '0',
                paddingLeft: 'calc(4rem + 2rem)',
              }}>
                <p style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.75rem',
                  lineHeight: 1.7,
                  color: '#666',
                  maxWidth: '600px',
                }}>
                  {project.description}
                </p>
              </div>
            </div>
          ))}

          {/* Bottom border */}
          <div style={{ borderTop: '1px solid #1a1a1a' }} />
        </div>
      </div>

      {/* ── Floating preview card ── */}
      <div
        ref={previewRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9980,
          width: '280px',
          height: '180px',
          pointerEvents: 'none',
          opacity: 0,
          scale: 0.9,
          borderRadius: '2px',
          overflow: 'hidden',
          border: '1px solid #222',
        }}
      >
        {activeIdx !== null && (
          <>
            <div style={{
              width: '100%',
              height: '100%',
              background: PROJECTS[activeIdx].gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              {/* Fake "code editor" aesthetic */}
              <div style={{ width: '80%' }}>
                {[0.6, 0.8, 0.5, 0.9, 0.4].map((w, i) => (
                  <div key={i} style={{
                    height: '2px',
                    width: `${w * 100}%`,
                    background: i % 2 === 0
                      ? PROJECTS[activeIdx].color + '44'
                      : '#ffffff11',
                    marginBottom: '6px',
                    borderRadius: '1px',
                  }} />
                ))}
              </div>
              <div style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: PROJECTS[activeIdx].color,
                opacity: 0.8,
              }}>
                {PROJECTS[activeIdx].type}
              </div>
            </div>
            {/* Overlay label */}
            <div style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: '0.75rem',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#F5F0E8',
              letterSpacing: '-0.01em',
            }}>
              {PROJECTS[activeIdx].title}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
