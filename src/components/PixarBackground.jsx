import React, { useState, useEffect, useRef } from 'react'
import './PixarBackground.css'

const SCENES = ['info', 'tech', 'studies', 'projects']

export default function PixarBackground() {
  const [activeIndex, setActiveIndex] = useState(0)
  const baseUrl = import.meta.env.BASE_URL || '/'

  useEffect(() => {
    const sections = SCENES.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SCENES.indexOf(entry.target.id)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach((sec) => observer.observe(sec))
    return () => observer.disconnect()
  }, [])

  const images = [
    { src: `${baseUrl}images/scene-info.jpg`, alt: 'Info Scene' },
    { src: `${baseUrl}images/scene-tech.jpg`, alt: 'Tech Scene' },
    { src: `${baseUrl}images/scene-studies.jpg`, alt: 'Studies Scene' },
    { src: `${baseUrl}images/scene-projects.jpg`, alt: 'Projects Scene' }
  ]

  return (
    <div className="pixar-background" aria-hidden="true">
      {images.map((img, i) => (
        <div
          key={img.src}
          className={`bg-layer ${activeIndex === i ? 'active' : ''}`}
          style={{ zIndex: i + 1 }}
        >
          <img src={img.src} alt={img.alt} className="bg-img" />
        </div>
      ))}

      {/* High-Tech Overlays for Readability and Mood */}
      <div className="tech-overlay"></div>
      <div className="tech-grid-pattern"></div>
      <div className="tech-vignette"></div>
    </div>
  )
}
