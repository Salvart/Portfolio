import React from 'react'
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
  const { index, displayIndex, transitioning, goTo, finishTransition } = useSectionController(
    sections.length,
    reducedMotion
  )

  return (
    <main className="experience">
      {/* La escena y todos los efectos quedan aislados debajo del texto. */}
      <div className="backdrop-stack">
        <MotherboardScene
          index={index}
          reducedMotion={reducedMotion}
          onJourneyComplete={finishTransition}
        />
        <div className="camera-lens" aria-hidden="true" />
        <div className="vhs-overlay" aria-hidden="true" />
      </div>
      <SceneText section={sections[displayIndex]} lang={lang} transitioning={transitioning} />
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
