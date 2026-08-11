import { Link } from 'react-router-dom'
import { preloadOnIntent } from '../../routeLoaders'
import boxScorePreview from './assets/box-score.png'
import pulsarPreview from './assets/pulsar-navigation-lab.png'
import gardenPreview from './assets/the-garden.png'
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
            <div className="subway-card-shot" aria-hidden="true">
              <div className="subway-card-bar"><strong>SUBWAY <i>LIVE</i></strong><span><b/> MTA FEED LIVE</span><time>8:42 PM</time></div>
              <div className="subway-card-sidebar"><small>NETWORK PULSE</small><strong>287</strong><span>ACTIVE TRIPS</span><p>A real-time view of the city in motion.</p><div><i>1</i><i>4</i><i>A</i><i>F</i><i>N</i><i>J</i></div></div>
              <div className="subway-card-map">
                <svg viewBox="0 0 720 390" preserveAspectRatio="xMidYMid slice">
                  <path className="sp-land" d="M82 390L166 344 190 278 237 229 247 169 284 113 314 18 363 0 381 55 359 119 325 183 300 242 252 297 212 364ZM315 390L357 333 400 291 454 273 512 220 573 211 632 237 720 225V390ZM420 0L456 65 505 100 568 107 623 145 720 163V0Z"/>
                  <g className="sp-roads"><path d="M103 358L354 31M173 382L487 56M315 373L674 239M352 331L669 143M259 267L572 101"/><path d="M68 316L297 210M255 348L590 218M333 123L707 177"/></g>
                  <g className="sp-routes">
                    <path className="route-a" d="M138 365C181 323 213 291 246 249S310 158 349 36"/>
                    <path className="route-1" d="M194 373C213 331 234 292 263 250S321 150 365 31"/>
                    <path className="route-4" d="M225 373C251 327 273 285 294 236S345 132 385 24"/>
                    <path className="route-f" d="M159 338C221 314 266 292 309 269S398 248 454 272 548 302 632 280"/>
                    <path className="route-j" d="M279 306C346 294 393 281 438 259S517 218 594 219"/>
                    <path className="route-m" d="M279 298C345 286 391 273 434 251S514 210 593 211"/>
                    <path className="route-n" d="M201 352C265 316 308 289 347 256S418 193 471 166 568 148 671 166"/>
                  </g>
                  <g className="sp-stops"><path d="M138 365L349 36M194 373L365 31M225 373L385 24M159 338L632 280M279 302L594 215M201 352L671 166"/></g>
                </svg>
                <b className="sp-marker marker-a">A<span>↗</span></b><b className="sp-marker marker-4">4<span>↑</span></b><b className="sp-marker marker-m">M<span>↗</span></b><b className="sp-marker marker-n">N<span>→</span></b>
                <span className="subway-card-caption">LIVE TRAINS · NEW YORK CITY</span>
              </div>
            </div>
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
