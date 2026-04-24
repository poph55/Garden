export default function QuoteEntry({ content, person, source, dateAdded }) {
  return (
    <div className="quote-entry">
      <blockquote className="quote-body">
        <p>{content}</p>
      </blockquote>
      <div className="quote-footer">
        <div className="quote-attribution">
          <span className="quote-person">— {person}</span>
          {source && <span className="quote-source">{source}</span>}
        </div>
        <p className="quote-date">{dateAdded}</p>
      </div>
    </div>
  )
}
