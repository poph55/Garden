export default function PaintingEntry({ title, artist, year, dateAdded }) {
  return (
    <div className="painting-entry">
      <div className="painting-header">
        <span className="painting-title">{title}</span>
        <span className="painting-artist">{artist}{year && `, ${year}`}</span>
      </div>
      <p className="painting-date">{dateAdded}</p>
    </div>
  )
}
