import { useEffect, useRef } from 'react'
import './Overgrown.css'

export default function Overgrown() {
  const gameHost = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = gameHost.current
    if (!host) return
    let disposed = false
    let destroy: (() => void) | undefined

    import('./game/createGame').then(({ createGame }) => {
      if (disposed) return
      const game = createGame(host)
      destroy = () => game.destroy(true)
    })

    return () => {
      disposed = true
      destroy?.()
    }
  }, [])

  return (
    <main className="overgrown-page">
      <header className="overgrown-header">
        <a href="/projects" className="overgrown-back">← projects</a>
        <div>
          <p className="overgrown-kicker">creature-collecting rpg prototype</p>
          <h1>Overgrown</h1>
        </div>
        <p className="overgrown-controls"><span>move</span> arrows / WASD · <span>interact</span> space / enter</p>
      </header>

      <section className="overgrown-game-shell" aria-label="Overgrown game prototype">
        <div ref={gameHost} className="overgrown-game" />
      </section>

      <footer className="overgrown-notes">
        <span>variable-shape maps</span>
        <span>16px tiles</span>
        <span>240 × 160 viewport</span>
        <span>cell interactions</span>
        <span>art by limezu</span>
      </footer>
    </main>
  )
}
