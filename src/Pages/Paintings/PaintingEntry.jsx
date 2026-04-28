export default function PaintingEntry({ title, artist, year, image, dateAdded, onImageClick, onLoad }) {
  return (
    <div className="painting-entry">
      <button
        className="painting-img-btn"
        onClick={onImageClick}
        aria-label={`Enlarge ${title}`}
      >
        <img
          src={image}
          alt={title}
          className="painting-img"
          onLoad={e => onLoad?.(e.target.naturalWidth, e.target.naturalHeight)}
        />
      </button>
      <div className="painting-meta">
        <span className="painting-title">{title}</span>
        <div className="painting-bottom-row">
          <span className="painting-artist">
            {artist}{year && `, ${year}`}
          </span>
          {dateAdded && <span className="painting-date">{dateAdded}</span>}
        </div>
      </div>
    </div>
  )
}
