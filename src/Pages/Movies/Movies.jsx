import { useState } from 'react'
import Layout from '../../components/Layout'
import MovieEntry from './MovieEntry'
import Lightbox from './Lightbox'
import whiplash from './posters/Whiplash (2014).jpg'
import whiplash2 from './posters/Whiplash (2014).png'
import bugoniaClassic from './posters/Bugonia (2025) classic.jpg'
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
    title: 'Bugonia',
    year: 2025,
    director: 'Yorgos Lanthimos',
    notes: `my dad would've loved this movie so I have to love it in his place`,
    link: 'https://www.imdb.com/title/tt12300742/',
    poster: [bugoniaClassic, bugoniaHive, bugoniaBasement],
    dateAdded: 'Apr 15, 2026',
  },
].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))

function getPosters(entry) {
  return Array.isArray(entry.poster) ? entry.poster : [entry.poster].filter(Boolean)
}

export default function Movies() {
  const [lightbox, setLightbox] = useState(null) // { movieIdx, posterIdx }

  const openLightbox = (movieIdx, posterIdx) => setLightbox({ movieIdx, posterIdx })
  const closeLightbox = () => setLightbox(null)

  const prevMovie = () => setLightbox(lb => ({
    movieIdx: (lb.movieIdx - 1 + entries.length) % entries.length,
    posterIdx: 0,
  }))
  const nextMovie = () => setLightbox(lb => ({
    movieIdx: (lb.movieIdx + 1) % entries.length,
    posterIdx: 0,
  }))
  const prevPoster = () => setLightbox(lb => {
    const posters = getPosters(entries[lb.movieIdx])
    return { ...lb, posterIdx: (lb.posterIdx - 1 + posters.length) % posters.length }
  })
  const nextPoster = () => setLightbox(lb => {
    const posters = getPosters(entries[lb.movieIdx])
    return { ...lb, posterIdx: (lb.posterIdx + 1) % posters.length }
  })

  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">movies</h1>
        </div>
      </section>

      <section className="movie-list">
        <div className="container">
          <div className="movie-grid">
            {entries.map((entry, i) => (
              <MovieEntry key={i} {...entry} onPosterClick={posterIdx => openLightbox(i, posterIdx)} />
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          entries={entries}
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
