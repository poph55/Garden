import { Link } from 'react-router-dom'
import { preloadOnIntent } from '../../routeLoaders'
import boxScorePreview from './assets/box-score.png'
import pulsarPreview from './assets/pulsar-navigation-lab.png'
import gardenPreview from './assets/the-garden.png'
import subwayPreview from './assets/subway-live.webp'
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
            <p className="project-type">Live transit visualization</p>
            <h2>Subway Live</h2>
            <p>A living diagram of New York City’s subway—showing active trains, service patterns, and the pulse of the network in real time.</p>
            <Link className="project-visit" to="/projects/subway-live" {...preloadOnIntent('subway-live')}>Watch the network →</Link>
          </div>
          <Link className="project-preview subway-preview" to="/projects/subway-live" aria-label="Open Subway Live" {...preloadOnIntent('subway-live')}>
            <img src={subwayPreview} alt="Subway Live displaying active New York City subway trains over the city map" width="1400" height="875" loading="lazy" decoding="async" />
          </Link>
        </article>

        <article className="project-row">
          <p className="project-number">02</p>
          <div className="project-copy">
            <p className="project-type">Sports data visualization</p>
            <h2>Box Score</h2>
            <p>A fast, visual way to find a baseball game and understand how it unfolded—from the first pitch to the final out.</p>
            <Link className="project-visit" to="/projects/box-score" {...preloadOnIntent('box-score')}>Explore scores →</Link>
          </div>
          <Link className="project-preview" to="/projects/box-score" aria-label="Open Box Score visualizer" {...preloadOnIntent('box-score')}>
            <img src={boxScorePreview} alt="Box Score visualizer showing Mets and Braves batting data over a Truist Park spray chart" width="1269" height="714" loading="lazy" decoding="async" />
          </Link>
        </article>

        <article className="project-row">
          <p className="project-number">03</p>
          <div className="project-copy">
            <p className="project-type">Interactive simulation</p>
            <h2>Pulsar Simulation</h2>
            <p>An interactive X-ray pulsar navigation lab for estimating a spacecraft’s position from simulated photon arrival data.</p>
            <a
              className="project-visit"
              href="/pulsarnav"
            >
              Visit project →
            </a>
          </div>
          <a
            className="project-preview"
            href="/pulsarnav"
            aria-label="Open Pulsar Navigation Lab"
          >
            <img src={pulsarPreview} alt="Pulsar Navigation Lab showing a spacecraft position solution from three pulsars" width="1041" height="905" loading="lazy" decoding="async" />
          </a>
        </article>

        <article className="project-row">
          <p className="project-number">04</p>
          <div className="project-copy">
            <p className="project-type">Personal digital garden</p>
            <h2>The Garden</h2>
            <p>A growing, hand-curated collection of films, music, books, words, paintings, tools, and other things worth remembering.</p>
            <Link className="project-visit" to="/garden" {...preloadOnIntent('garden')}>Enter the garden →</Link>
          </div>
          <Link className="project-preview" to="/garden" aria-label="Enter the Garden" {...preloadOnIntent('garden')}>
            <img src={gardenPreview} alt="The Garden homepage showing its illustrated collection grid" width="1044" height="905" loading="lazy" decoding="async" />
          </Link>
        </article>
      </section>
    </main>
  )
}
