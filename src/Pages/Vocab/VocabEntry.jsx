export default function VocabEntry({ term, partOfSpeech, definition, source, dateAdded }) {
  return (
    <div className="vocab-entry">
      <div className="vocab-term-row">
        <span className="vocab-term">{term}</span>
        {partOfSpeech && <span className="vocab-pos">{partOfSpeech}</span>}
      </div>
      <p className="vocab-definition">{definition}</p>
      <div className="vocab-entry-footer">
        {source && <span className="vocab-source">{source}</span>}
        {dateAdded && <span className="vocab-date">{dateAdded}</span>}
      </div>
    </div>
  )
}
