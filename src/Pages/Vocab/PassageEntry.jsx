export default function PassageEntry({ text, page }) {
  return (
    <div className="passage-entry">
      <p className="passage-text">{text}</p>
      {page != null && <p className="passage-page">p. {page}</p>}
    </div>
  )
}
