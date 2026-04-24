export default function PassageEntry({ text, page, source, dateAdded }) {
  return (
    <div className="passage-entry">
      <p className="passage-text">{text}</p>
      <div className="passage-footer">
        {source && <span className="passage-source">{source}</span>}
        <span className="passage-page-date">
          {dateAdded && <span className="passage-date">{dateAdded}</span>}
          {page != null && <span className="passage-page">p. {page}</span>}
        </span>
      </div>
    </div>
  )
}
