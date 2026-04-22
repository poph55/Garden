export default function PoetryEntry({ title, author, poem, dateAdded }) {
  return (
    <div className="poetry-entry">
      <div className="poetry-header">
        <span className="poetry-title">{title}</span>
        <span className="poetry-author">{author}</span>
      </div>
      <pre className="poetry-body">{poem}</pre>
      <p className="poetry-date">{dateAdded}</p>
    </div>
  )
}
