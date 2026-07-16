export default function PaintingEntry({ title, artist, year, thumbnail, width, height, dateAdded, onImageClick }) {
  return (
    <div className="painting-entry">
      <button
        className="painting-img-btn"
        onClick={onImageClick}
        aria-label={`Enlarge ${title}`}
      >
        <img
          src={thumbnail}
          alt={title}
          className="painting-img"
          loading="lazy"
          decoding="async"
          width={width}
          height={height}
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
