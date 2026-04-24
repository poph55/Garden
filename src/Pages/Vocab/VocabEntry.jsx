export default function VocabEntry({ term, partOfSpeech, definition, source }) {
  return (
    <div className="vocab-entry">
      <div className="vocab-term-row">
        <span className="vocab-term">{term}</span>
        {partOfSpeech && <span className="vocab-pos">{partOfSpeech}</span>}
      </div>
      <p className="vocab-definition">{definition}</p>
      {source && <p className="vocab-source">{source}</p>}
    </div>
  )
}
