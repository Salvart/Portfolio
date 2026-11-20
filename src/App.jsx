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
  const { index, transitioning, goTo } = useSectionController(sections.length, reducedMotion)

  return (
    <main className="experience">
      <MotherboardScene index={index} reducedMotion={reducedMotion} />
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
