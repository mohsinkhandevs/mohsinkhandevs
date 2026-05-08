import React from 'react'

export default function Nav({ visible }) {
  if (!visible) return null;
  return (
    <nav className="fixed top-0 left-0 w-full p-4 z-50 flex justify-between items-center mix-blend-difference text-white">
      <div className="font-bold text-xl tracking-tighter">Mohsin Khan</div>
      <ul className="flex space-x-6 text-sm">
        <li><a href="#about">About</a></li>
        <li><a href="#works">Works</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  )
}
