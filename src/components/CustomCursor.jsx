/**
 * CustomCursor.jsx
 * ─────────────────────────────────────────────────────────────────
 * A two-layer cursor system:
 *   • Small dot  — follows mouse exactly (no lag)
 *   • Large ring — follows with a smooth lerp delay
 *
 * States:
 *   default   → dot 8px, ring 40px
 *   hovering  → dot 0px (hidden), ring 80px expanded with label
 *   clicking  → ring scales down to 0.8
 *   text      → thin blinking I-beam style
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  // Raw mouse positions for the dot (instant)
  const dotX = useMotionValue(0)
  const dotY = useMotionValue(0)

  // Smooth spring positions for the ring (lagged)
  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 }
  const ringX = useSpring(useMotionValue(0), springConfig)
  const ringY = useSpring(useMotionValue(0), springConfig)

  const rawX = useRef(0)
  const rawY = useRef(0)

  const [cursorState, setCursorState] = useState('default') // default | hover | click | text
  const [hoverLabel, setHoverLabel] = useState('')

  useEffect(() => {
    const onMouseMove = (e) => {
      rawX.current = e.clientX
      rawY.current = e.clientY

      dotX.set(e.clientX)
      dotY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)
    }

    const onMouseDown = () => setCursorState((s) => s === 'hover' ? 'hover-click' : 'click')
    const onMouseUp   = () => setCursorState((s) => s === 'hover-click' ? 'hover' : 'default')

    const onMouseEnterLink = (e) => {
      const el = e.currentTarget
      const label = el.dataset.cursorLabel || ''
      setHoverLabel(label)
      setCursorState('hover')
    }
    const onMouseLeaveLink = () => {
      setHoverLabel('')
      setCursorState('default')
    }
    const onMouseEnterText = () => setCursorState('text')
    const onMouseLeaveText = () => setCursorState('default')

    // Attach hover listeners to all interactive elements
    const bindInteractives = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink)
        el.addEventListener('mouseleave', onMouseLeaveLink)
      })
      document.querySelectorAll('p, h1, h2, h3, h4, span.text-selectable').forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterText)
        el.addEventListener('mouseleave', onMouseLeaveText)
      })
    }

    bindInteractives()

    // Re-bind on DOM mutations (for dynamically added elements)
    const observer = new MutationObserver(bindInteractives)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      observer.disconnect()
    }
  }, [dotX, dotY, ringX, ringY])

  /* ── Variant maps ── */
  const dotVariants = {
    default:      { width: 6,  height: 6,  opacity: 1, backgroundColor: '#C8FF4E' },
    hover:        { width: 0,  height: 0,  opacity: 0, backgroundColor: '#C8FF4E' },
    'hover-click':{ width: 0,  height: 0,  opacity: 0, backgroundColor: '#C8FF4E' },
    click:        { width: 12, height: 12, opacity: 1, backgroundColor: '#C8FF4E' },
    text:         { width: 3,  height: 22, opacity: 1, backgroundColor: '#C8FF4E', borderRadius: '0px' },
  }

  const ringVariants = {
    default:      { width: 36, height: 36, opacity: 0.5, border: '1px solid #C8FF4E', backgroundColor: 'transparent', scale: 1 },
    hover:        { width: 72, height: 72, opacity: 1,   border: '1px solid #C8FF4E', backgroundColor: 'rgba(200,255,78,0.08)', scale: 1 },
    'hover-click':{ width: 72, height: 72, opacity: 1,   border: '1px solid #C8FF4E', backgroundColor: 'rgba(200,255,78,0.15)', scale: 0.85 },
    click:        { width: 28, height: 28, opacity: 0.8, border: '1px solid #C8FF4E', backgroundColor: 'transparent', scale: 0.8 },
    text:         { width: 2,  height: 30, opacity: 0,   border: '0px solid transparent', backgroundColor: 'transparent', scale: 1 },
  }

  const transition = { type: 'spring', damping: 20, stiffness: 300, mass: 0.4 }

  return (
    <>
      {/* ── Dot: instant ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 999999,
          borderRadius: '50%',
          pointerEvents: 'none',
          mixBlendMode: 'difference',
        }}
        variants={dotVariants}
        animate={cursorState}
        transition={transition}
      />

      {/* ── Ring: lagged spring ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 999998,
          borderRadius: '50%',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        variants={ringVariants}
        animate={cursorState}
        transition={transition}
      >
        {/* Label inside cursor on hover */}
        {hoverLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '8px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#C8FF4E',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {hoverLabel}
          </motion.span>
        )}
      </motion.div>
    </>
  )
}
