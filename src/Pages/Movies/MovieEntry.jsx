import { useState } from 'react'

export default function MovieEntry({ poster, title, year, director, link, notes, dateAdded, onPosterClick }) {
  const posters = Array.isArray(poster) ? poster : [poster].filter(Boolean)
  const [idx, setIdx] = useState(0)
  const multi = posters.length > 1

  const prev = e => { e.preventDefault(); setIdx(i => (i - 1 + posters.length) % posters.length) }
  const next = e => { e.preventDefault(); setIdx(i => (i + 1) % posters.length) }

  return (
    <div className="movie-entry">
      <div className="movie-poster-wrap">
        <button className="movie-poster-btn" onClick={() => onPosterClick(idx)} aria-label={`Enlarge ${title} poster`}>
          {posters[idx]
            ? <img src={posters[idx]} alt={title} className="movie-poster" />
            : <div className="movie-poster movie-poster--placeholder" />
          }
        </button>
        {multi && (
          <>
            <button className="poster-arrow poster-arrow--left" onClick={prev} aria-label="Previous poster">&#8249;</button>
            <button className="poster-arrow poster-arrow--right" onClick={next} aria-label="Next poster">&#8250;</button>
            <div className="poster-dots">
              {posters.map((_, i) => (
                <span key={i} className={`poster-dot${i === idx ? ' poster-dot--active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="movie-body">
        <div className="movie-top-row">
          <a href={link} target="_blank" rel="noreferrer" className="movie-title">{title}</a>
          {year && <span className="movie-year">{year}</span>}
        </div>
        {director && <p className="movie-director">{director}</p>}
        {notes && <p className="movie-notes">{notes}</p>}
        {dateAdded && <p className="movie-date">{dateAdded}</p>}
      </div>
    </div>
  )
}
