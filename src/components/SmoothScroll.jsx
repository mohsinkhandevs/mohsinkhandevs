/**
 * SmoothScroll.jsx
 * ─────────────────────────────────────────────────────────────────
 * Lenis smooth scrolling wrapper.
 *
 * • Initialises Lenis with premium easing (expo out)
 * • Registers Lenis's raf loop with GSAP's ticker for perfect
 *   sync between scroll and GSAP ScrollTrigger animations
 * • Exposes the lenis instance via a React context so child
 *   components can call lenis.scrollTo() programmatically
 * ─────────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext(null)

export function useLenis() {
  return useContext(LenisContext)
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Use GSAP ticker instead of requestAnimationFrame for perfect sync
    const gsapTicker = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(gsapTicker)
    gsap.ticker.lagSmoothing(0)

    // Expose lenis instance on window for debugging
    if (import.meta.env.DEV) {
      window.__lenis = lenis
    }

    return () => {
      lenis.destroy()
      gsap.ticker.remove(gsapTicker)
    }
  }, [])

  const scrollTo = (target, options = {}) => {
    lenisRef.current?.scrollTo(target, { duration: 1.4, ...options })
  }

  return (
    <LenisContext.Provider value={{ lenis: lenisRef, scrollTo }}>
      {children}
    </LenisContext.Provider>
  )
}
