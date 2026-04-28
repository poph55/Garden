import { useEffect } from 'react'

export default function PaintingLightbox({ entries, idx, onClose, onPrev, onNext }) {
  const entry = entries[idx]
  const multi = entries.length > 1

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <div className="lightbox" onClick={onClose}>
      {multi && (
        <button
          className="lb-movie-arrow lb-movie-arrow--left"
          onClick={e => { e.stopPropagation(); onPrev() }}
          aria-label="Previous painting"
        >
          &#8249;
        </button>
      )}

      <div className="lb-content" onClick={e => e.stopPropagation()}>
        <img src={entry.image} alt={entry.title} className="lb-img lb-painting-img" />
        <div className="lb-painting-caption">
          <span className="lb-painting-title">{entry.title}</span>
          <span className="lb-painting-artist">
            {entry.artist}{entry.year && `, ${entry.year}`}
          </span>
        </div>
      </div>

      {multi && (
        <button
          className="lb-movie-arrow lb-movie-arrow--right"
          onClick={e => { e.stopPropagation(); onNext() }}
          aria-label="Next painting"
        >
          &#8250;
        </button>
      )}
    </div>
  )
}
