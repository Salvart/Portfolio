import React, { useEffect, useRef } from 'react'
import MinimalNav from './components/MinimalNav.jsx'
import SceneText from './components/SceneText.jsx'
import { sections } from './content/portfolio.js'
import useReducedMotion from './hooks/useReducedMotion.js'
import useSectionController from './hooks/useSectionController.js'
import MotherboardScene from './scene/MotherboardScene.jsx'
import { useI18n } from './utils/i18n.jsx'
import './styles.css'

export default function App() {
  const { lang, setLang } = useI18n()
  const reducedMotion = useReducedMotion()
  const { index, transitioning, goTo } = useSectionController(sections.length, reducedMotion)
  const lensRef = useRef(null)

  // El destello de la lente sigue al mismo punto que ilumina el foco 3D.
  useEffect(() => {
    const onPointerMove = (event) => {
      const lens = lensRef.current
      if (!lens) return
      lens.style.setProperty('--lens-x', `${(event.clientX / window.innerWidth) * 100}%`)
      lens.style.setProperty('--lens-y', `${(event.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <main className="experience">
      {/* La escena y todos los efectos quedan aislados debajo del texto. */}
      <div className="backdrop-stack">
        <MotherboardScene index={index} reducedMotion={reducedMotion} />
        <div ref={lensRef} className="camera-lens" aria-hidden="true" />
        <div className="vhs-overlay" aria-hidden="true" />
      </div>
      <SceneText section={sections[index]} lang={lang} transitioning={transitioning} />
      <MinimalNav
        index={index}
        count={sections.length}
        goTo={goTo}
        lang={lang}
        setLang={setLang}
      />
    </main>
  )
}
