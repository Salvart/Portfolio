declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number
    spread?: number
    origin?: { y: number }
  }
  const confetti: (options?: ConfettiOptions) => void
  export default confetti
}
