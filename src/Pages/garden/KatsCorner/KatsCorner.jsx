import { Link } from 'react-router-dom'
import { preloadOnIntent } from '../../../routeLoaders'
import './KatsCorner.css'

export default function KatsCorner() {
  return <main className="kats-corner">
    <Link to="/garden" className="kats-corner-back">← back to the garden</Link>
    <header><p className="eyebrow">A small studio for monthly selling reports</p><h1>Kat’s Corner <span>♥</span></h1></header>
    <section className="kat-project-list">
      <p className="kat-project-number">01</p>
      <div><p className="eyebrow">Data tool</p><h2>Monthly report builder</h2><p>Match every style to its product image, review the selling order, and export an editable report.</p>
        <Link className="kat-project-visit" to="/garden/kats-corner/file-workspace" {...preloadOnIntent('file-workspace')}>Build a report →</Link>
      </div>
    </section>
  </main>
}
