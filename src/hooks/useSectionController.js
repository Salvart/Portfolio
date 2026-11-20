import { useCallback, useEffect, useRef, useState } from 'react'
import { TRANSITION_MS } from '../scene/cameraJourney.js'

const SWIPE_THRESHOLD = 45

export default function useSectionController(count, reducedMotion = false) {
  const [index, setIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const indexRef = useRef(0)
  const lockedRef = useRef(false)
  const timerRef = useRef(null)

  // Se llama desde el bucle de la cámara cuando el recorrido llega a su fin.
  // Hasta ese momento el texto sigue siendo el de la sección anterior.
  const finishTransition = useCallback(() => {
    if (!lockedRef.current) return
    lockedRef.current = false
    window.clearTimeout(timerRef.current)
    setDisplayIndex(indexRef.current)
    setTransitioning(false)
  }, [])

  const goTo = useCallback(
    (next) => {
      if (next < 0 || next >= count || next === indexRef.current || lockedRef.current) return

      indexRef.current = next
      setIndex(next)

      if (reducedMotion) {
        setDisplayIndex(next)
        return
      }

      lockedRef.current = true
      setTransitioning(true)
      // Red de seguridad si WebGL no está disponible y no hay bucle que avise.
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(finishTransition, TRANSITION_MS + 200)
    },
    [count, reducedMotion, finishTransition]
  )

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo])
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  useEffect(() => {
    let touchStartY = null

    const onWheel = (event) => {
      event.preventDefault()
      if (Math.abs(event.deltaY) < 8) return
      goTo(indexRef.current + (event.deltaY > 0 ? 1 : -1))
    }

    const onKeyDown = (event) => {
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('a')) return
      const onButton = Boolean(target?.closest('button'))

      const forward = ['ArrowDown', 'PageDown', ' ', 'Spacebar']
      const backward = ['ArrowUp', 'PageUp']

      if (event.key === 'Home') {
        event.preventDefault()
        goTo(0)
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        goTo(count - 1)
        return
      }
      if (forward.includes(event.key)) {
        if (onButton && event.key !== 'ArrowDown' && event.key !== 'PageDown') return
        event.preventDefault()
        next()
        return
      }
      if (backward.includes(event.key)) {
        event.preventDefault()
        prev()
      }
    }

    const onTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? null
    }
    const onTouchEnd = (event) => {
      if (touchStartY === null) return
      const endY = event.changedTouches[0]?.clientY
      touchStartY = null
      if (endY === undefined) return
      const delta = touchStartY - endY
      if (Math.abs(delta) < SWIPE_THRESHOLD) return
      goTo(indexRef.current + (delta > 0 ? 1 : -1))
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [count, goTo, next, prev])

  return { index, displayIndex, transitioning, goTo, next, prev, finishTransition }
}
