import React, { useState, useEffect } from 'react'
import './PixarBackground.css'

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

export default function PixarBackground() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      if (docHeight > 0) {
        const rawP = (scrollTop / docHeight) * 3
        setProgress(clamp(rawP, 0, 3))
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const op1 = clamp(progress - 0, 0, 1)
  const op2 = clamp(progress - 1, 0, 1)
  const op3 = clamp(progress - 2, 0, 1)

  return (
    <div className="pixar-background" aria-hidden="true">
      {/* Layer 0: Info (Armchair / Newspaper) */}
      <div
        className="bg-layer"
        style={{
          opacity: 1,
          zIndex: 1,
          transform: `scale(${1 + progress * 0.01})`
        }}
      >
        <img src="images/scene-info.jpg" alt="Info Scene" className="bg-img" />
      </div>

      {/* Layer 1: Tech (PC Workstation) */}
      <div
        className="bg-layer"
        style={{
          opacity: op1,
          zIndex: 2,
          transform: `scale(${1 + progress * 0.012})`
        }}
      >
        <img src="images/scene-tech.jpg" alt="Tech Scene" className="bg-img" />
      </div>

      {/* Layer 2: Studies (Desk / Books & Schematics) */}
      <div
        className="bg-layer"
        style={{
          opacity: op2,
          zIndex: 3,
          transform: `scale(${1 + progress * 0.014})`
        }}
      >
        <img src="images/scene-studies.jpg" alt="Studies Scene" className="bg-img" />
      </div>

      {/* Layer 3: Projects (Electronics Maker Workbench) */}
      <div
        className="bg-layer"
        style={{
          opacity: op3,
          zIndex: 4,
          transform: `scale(${1 + progress * 0.016})`
        }}
      >
        <img src="images/scene-projects.jpg" alt="Projects Scene" className="bg-img" />
      </div>

      {/* High-Tech Overlays for Readability and Mood */}
      <div className="tech-overlay"></div>
      <div className="tech-grid-pattern"></div>
      <div className="tech-vignette"></div>
    </div>
  )
}
