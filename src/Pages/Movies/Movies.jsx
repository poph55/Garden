import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import MovieEntry from './MovieEntry'
import Lightbox from './Lightbox'
import movieProjectorIcon from '../../assets/optimized/movie-projector-Original.webp'
import intolerableCruelty from './posters/optimized/Intolerable Cruelty - Intolerable Cruelty (2003)_jpeg.webp'
import primer1 from './posters/optimized/Primer - Primer (2004)_jpg.webp'
import primer2 from './posters/optimized/Primer - Primer (2004) (1)_jpg.webp'
import moonstruck from './posters/optimized/Moonstruck - Moonstruck (1987)_jpg.webp'
import annihilation1 from './posters/optimized/Annihilation - Annihilation (2018)_jpeg.webp'
import annihilation2 from './posters/optimized/Annihilation - Annihilation (2018) (1)_jpeg.webp'
import perfectBlue1 from './posters/optimized/Perfect Blue - Perfect Blue (1998)_png.webp'
import perfectBlue2 from './posters/optimized/Perfect Blue - Perfect Blue (1998)_jpeg.webp'
import perfectBlue3 from './posters/optimized/Perfect Blue - Perfect Blue (1998) (1)_jpeg.webp'
import perfectBlue4 from './posters/optimized/Perfect Blue - Perfect Blue (1998) (2)_jpeg.webp'
import aftersunBeach from './posters/optimized/Aftersun - Aftersun (2022) beach_jpg.webp'
import aftersunHug from './posters/optimized/Aftersun - Aftersun (2022) hug_png.webp'
import spiritedAwayBridge1 from './posters/optimized/Spirited Away - Spirited Away (2001) bridge 1_png.webp'
import spiritedAwayBridge2 from './posters/optimized/Spirited Away - Spirited Away (2001) bridge 2_jpg.webp'
import spiritedAwayDragon from './posters/optimized/Spirited Away - Spirited Away (2001) dragon_jpeg.webp'
import duneTimmy from './posters/optimized/Dune - Dune Timmy_jpg.webp'
import duneDune from './posters/optimized/Dune - Dune Dune_png.webp'
import dunePartTwoTz from './posters/optimized/Dune Part Two - Dune- Part Two tz_png.webp'
import dunePartTwoDune from './posters/optimized/Dune Part Two - Dune- Part Two Dune_png.webp'
import whiplash from './posters/optimized/Whiplash - Whiplash (2014)_jpg.webp'
import whiplash2 from './posters/optimized/Whiplash - Whiplash (2014)_png.webp'
import inTheMoodForLove1 from './posters/optimized/In the Mood for Love - In the Mood for Love (2000)_jpg.webp'
import inTheMoodForLove2 from './posters/optimized/In the Mood for Love - In the Mood for Love (2000)_png.webp'
import bugoniaClassic from './posters/optimized/Bugonia - Bugonia (2025) classic_jpg.webp'
import weaponsClassic from './posters/optimized/Weapons - Weapons (2025) classic_jpg.webp'
import weaponsCinematic from './posters/optimized/Weapons - Weapons (2025) cinematic_jpg.webp'
import weaponsDrawing from './posters/optimized/Weapons - Weapons (2025) drawing_jpg.webp'
import bugoniaHive from './posters/optimized/Bugonia - Bugonia (2025) hive_png.webp'
import bugoniaBasement from './posters/optimized/Bugonia - Bugonia (2025) basement_png.webp'
import './Movies.css'

const entries = [
  {
    title: 'In the Mood for Love',
    year: 2000,
    director: 'Wong Kar-wai',
    link: 'https://www.imdb.com/title/tt0118694/',
    poster: [inTheMoodForLove1, inTheMoodForLove2],
    dateAdded: 'Apr 22, 2026',
  },
  {
    title: 'Intolerable Cruelty',
    year: 2003,
    director: ['Joel Coen', 'Ethan Coen'],
    link: 'https://www.imdb.com/title/tt0138524/',
    poster: [intolerableCruelty],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Primer',
    year: 2004,
    director: 'Shane Carruth',
    link: 'https://www.imdb.com/title/tt0390384/',
    poster: [primer1, primer2],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Moonstruck',
    year: 1987,
    director: 'Norman Jewison',
    link: 'https://www.imdb.com/title/tt0093565/',
    poster: [moonstruck],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Annihilation',
    year: 2018,
    director: 'Alex Garland',
    link: 'https://www.imdb.com/title/tt2798920/',
    poster: [annihilation1, annihilation2],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Perfect Blue',
    year: 1997,
    director: 'Satoshi Kon',
    link: 'https://www.imdb.com/title/tt0156887/',
    poster: [perfectBlue1, perfectBlue2, perfectBlue3, perfectBlue4],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Aftersun',
    year: 2022,
    director: 'Charlotte Wells',
    link: 'https://www.imdb.com/title/tt19770238/',
    poster: [aftersunBeach, aftersunHug],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Spirited Away',
    year: 2001,
    director: 'Hayao Miyazaki',
    link: 'https://www.imdb.com/title/tt0245429/',
    poster: [spiritedAwayBridge1, spiritedAwayBridge2, spiritedAwayDragon],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Dune',
    year: 2021,
    director: 'Denis Villeneuve',
    link: 'https://www.imdb.com/title/tt1160419/',
    poster: [duneTimmy, duneDune],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Dune: Part Two',
    year: 2024,
    director: 'Denis Villeneuve',
    link: 'https://www.imdb.com/title/tt15239678/',
    poster: [dunePartTwoTz, dunePartTwoDune],
    dateAdded: 'Apr 20, 2026',
  },
  {
    title: 'Whiplash',
    year: 2014,
    director: 'Damien Chazelle',
    notes: 'rushing or dragging',
    link: 'https://www.imdb.com/title/tt2582802/',
    poster: [whiplash, whiplash2],
    dateAdded: 'Apr 15, 2026',
  },
  {
    title: 'Weapons',
    year: 2025,
    director: 'Zach Cregger',
    link: 'https://www.imdb.com/title/tt26581740/',
    poster: [weaponsClassic, weaponsCinematic, weaponsDrawing],
    dateAdded: 'Apr 15, 2026',
  },
  {
    title: 'Bugonia',
    year: 2025,
    director: 'Yorgos Lanthimos',
    notes: `my dad would've loved this movie so I have to love it in his place`,
    link: 'https://www.imdb.com/title/tt12300742/',
    poster: [bugoniaClassic, bugoniaHive, bugoniaBasement],
    dateAdded: 'Apr 15, 2026',
  },
]

function getPosters(entry) {
  return Array.isArray(entry.poster) ? entry.poster : [entry.poster].filter(Boolean)
}

function sortEntries(list, by) {
  return [...list].sort((a, b) => {
    if (by === 'title')    return a.title.localeCompare(b.title)
    if (by === 'director') {
      const lastName = name => (name || '').split(' ').pop()
      const firstDirector = d => Array.isArray(d) ? d[0] : d
      return lastName(firstDirector(a.director)).localeCompare(lastName(firstDirector(b.director)))
    }
    if (by === 'year') return b.year - a.year
    return new Date(b.dateAdded) - new Date(a.dateAdded)
  })
}

export default function Movies() {
  const [sortBy, setSortBy] = useState('dateAdded')
  const [lightbox, setLightbox] = useState(null) // { movieIdx, posterIdx }

  const sorted = useMemo(() => sortEntries(entries, sortBy), [sortBy])

  const openLightbox = (movieIdx, posterIdx) => setLightbox({ movieIdx, posterIdx })
  const closeLightbox = () => setLightbox(null)

  const prevMovie = () => setLightbox(lb => ({
    movieIdx: (lb.movieIdx - 1 + sorted.length) % sorted.length,
    posterIdx: 0,
  }))
  const nextMovie = () => setLightbox(lb => ({
    movieIdx: (lb.movieIdx + 1) % sorted.length,
    posterIdx: 0,
  }))
  const prevPoster = () => setLightbox(lb => {
    const posters = getPosters(sorted[lb.movieIdx])
    return { ...lb, posterIdx: (lb.posterIdx - 1 + posters.length) % posters.length }
  })
  const nextPoster = () => setLightbox(lb => {
    const posters = getPosters(sorted[lb.movieIdx])
    return { ...lb, posterIdx: (lb.posterIdx + 1) % posters.length }
  })

  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title movies-title">
            <img src={movieProjectorIcon} alt="" className="movies-title-icon" aria-hidden="true" />
            movies
          </h1>
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="dateAdded">date added</option>
            <option value="title">title</option>
            <option value="director">director</option>
            <option value="year">release year</option>
          </select>
        </div>
      </div>

      <section className="movie-list">
        <div className="container">
          <div className="movie-grid">
            {sorted.map((entry, i) => (
              <MovieEntry key={entry.title} {...entry} onPosterClick={posterIdx => openLightbox(i, posterIdx)} />
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          entries={sorted}
          movieIdx={lightbox.movieIdx}
          posterIdx={lightbox.posterIdx}
          onClose={closeLightbox}
          onPrevMovie={prevMovie}
          onNextMovie={nextMovie}
          onPrevPoster={prevPoster}
          onNextPoster={nextPoster}
        />
      )}
    </Layout>
  )
}
