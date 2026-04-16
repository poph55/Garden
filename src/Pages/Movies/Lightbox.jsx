import { useEffect } from 'react'

export default function Lightbox({ entries, movieIdx, posterIdx, onClose, onPrevMovie, onNextMovie, onPrevPoster, onNextPoster }) {
  const entry = entries[movieIdx]
  const posters = Array.isArray(entry.poster) ? entry.poster : [entry.poster].filter(Boolean)
  const multiPoster = posters.length > 1
  const multiMovie = entries.length > 1

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrevMovie()
      if (e.key === 'ArrowRight') onNextMovie()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrevMovie, onNextMovie])

  return (
    <div className="lightbox" onClick={onClose}>

      {multiMovie && (
        <button className="lb-movie-arrow lb-movie-arrow--left" onClick={e => { e.stopPropagation(); onPrevMovie() }} aria-label="Previous movie">
          &#8249;
        </button>
      )}

      <div className="lb-content" onClick={e => e.stopPropagation()}>
        <img src={posters[posterIdx]} alt={entry.title} className="lb-img" />
        {multiPoster && (
          <div className="lb-poster-nav">
            <button className="lb-poster-arrow" onClick={onPrevPoster} aria-label="Previous poster">&#8249;</button>
            <div className="lb-poster-dots">
              {posters.map((_, i) => (
                <span key={i} className={`lb-poster-dot${i === posterIdx ? ' lb-poster-dot--active' : ''}`} />
              ))}
            </div>
            <button className="lb-poster-arrow" onClick={onNextPoster} aria-label="Next poster">&#8250;</button>
          </div>
        )}
      </div>

      {multiMovie && (
        <button className="lb-movie-arrow lb-movie-arrow--right" onClick={e => { e.stopPropagation(); onNextMovie() }} aria-label="Next movie">
          &#8250;
        </button>
      )}

    </div>
  )
}
