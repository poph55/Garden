import { Link } from 'react-router-dom'
import pulsarPreview from './assets/pulsar-navigation-lab.png'
import './Projects.css'

export default function Projects() {
  return (
    <main className="projects-page">
      <header className="projects-header">
        <Link to="/" className="projects-back">← Palmer Hudson</Link>
        <p className="projects-kicker">Selected work</p>
        <h1>Projects.</h1>
      </header>

      <section className="project-list" aria-label="Projects">
        <article className="project-row">
          <p className="project-number">01</p>
          <div className="project-copy">
            <p className="project-type">Interactive simulation</p>
            <h2>Pulsar Simulation</h2>
            <p>An interactive X-ray pulsar navigation lab for estimating a spacecraft’s position from simulated photon arrival data.</p>
            <a
              className="project-visit"
              href="https://pulsar-navigation-lab.palmalama.chatgpt.site/"
              target="_blank"
              rel="noreferrer"
            >
              Visit project ↗
            </a>
          </div>
          <a
            className="project-preview"
            href="https://pulsar-navigation-lab.palmalama.chatgpt.site/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Pulsar Navigation Lab"
          >
            <img src={pulsarPreview} alt="Pulsar Navigation Lab showing a spacecraft position solution from three pulsars" width="1041" height="905" />
          </a>
        </article>
      </section>
    </main>
  )
}
