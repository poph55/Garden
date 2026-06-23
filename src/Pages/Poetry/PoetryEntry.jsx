export default function PoetryEntry({ title, author, year, poem, dateAdded }) {
  return (
    <div className="poetry-entry">
      <div className="poetry-header">
        <span className="poetry-entry-title">{title}</span>
        <span className="poetry-author">{author}{year && `, ${year}`}</span>
      </div>
      <pre className="poetry-body">{poem}</pre>
      <p className="poetry-date">{dateAdded}</p>
    </div>
  )
}
