import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import MovieEntry from './MovieEntry'
import Lightbox from './Lightbox'
import whiplash from './posters/Whiplash (2014).jpg'
import whiplash2 from './posters/Whiplash (2014).png'
import bugoniaClassic from './posters/Bugonia (2025) classic.jpg'
import weaponsClassic from './posters/Weapons (2025) classic.jpg'
import weaponsCinematic from './posters/Weapons (2025) cinematic.jpg'
import weaponsDrawing from './posters/Weapons (2025) drawing.jpg'
import bugoniaHive from './posters/Bugonia (2025) hive.png'
import bugoniaBasement from './posters/Bugonia (2025) basement.png'
import './Movies.css'

const entries = [
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
      return lastName(a.director).localeCompare(lastName(b.director))
    }
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
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">movies</h1>
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="dateAdded">date added</option>
            <option value="title">title</option>
            <option value="director">director</option>
          </select>
        </div>
      </section>

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
