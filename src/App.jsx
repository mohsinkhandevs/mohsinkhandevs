/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────
 * Root orchestrator. Wires together:
 *   SmoothScroll (Lenis)  → wraps the entire tree
 *   CustomCursor          → portal-rendered, always on top
 *   Nav                   → sticky glassmorphism header
 *   Hero                  → entrance animation
 *   About                 → scroll-highlighted bio
 *   Works                 → project showcase
 *   Skills                → marquee tech stack
 *   Contact               → magnetic footer
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, lazy, Suspense } from 'react'
import SmoothScroll from './components/SmoothScroll'
import CustomCursor from './components/CustomCursor'
import Nav          from './components/Nav'
import Hero         from './components/Hero'

/* Lazy-load sections so the hero loads instantly */
const About   = lazy(() => import('./components/About'))
const Works   = lazy(() => import('./components/Works'))
const Skills  = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))

export default function App() {
  const [heroLoaded, setHeroLoaded] = useState(false)

  return (
    <SmoothScroll>
      {/* Custom cursor — rendered outside scroll context */}
      <CustomCursor />

      {/* Sticky nav — reveals after loader */}
      <Nav visible={heroLoaded} />

      {/* Main page content */}
      <main>
        <Hero onLoaded={() => setHeroLoaded(true)} />

        <Suspense fallback={null}>
          <About />
          <Works />
          <Skills />
          <Contact />
        </Suspense>
      </main>
    </SmoothScroll>
  )
}
