import { Link } from 'react-router-dom'
import './ProfessionalHome.css'

export default function ProfessionalHome() {
  return (
    <main className="professional-home">
      <header className="professional-hero">
        <p className="professional-name">Palmer Hudson</p>
        <h1>Software engineer.</h1>
      </header>

      <div className="professional-paths">
        <Link to="/projects" className="professional-card projects-card">
          <p className="card-number">01</p>
          <div>
            <h2>Projects</h2>
            <p>A home for software, experiments, and things I’m building.</p>
            <p className="coming-soon">View projects ↗</p>
          </div>
        </Link>

        <Link to="/garden" className="professional-card garden-card">
          <p className="card-number">02</p>
          <div>
            <h2>The garden <span aria-hidden="true">↗</span></h2>
            <p>A growing collection of things I enjoy and want to remember.</p>
          </div>
        </Link>
      </div>
    </main>
  )
}
