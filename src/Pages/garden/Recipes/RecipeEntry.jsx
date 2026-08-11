export default function RecipeEntry({ title, source, link, category, notes, dateAdded }) {
  return (
    <div className="recipe-entry">
      <div className="recipe-top">
        <div className="recipe-title-row">
          {link
            ? <a href={link} target="_blank" rel="noreferrer" className="recipe-title">{title}</a>
            : <span className="recipe-title">{title}</span>
          }
          {category && <span className="recipe-category">{category}</span>}
        </div>
        {source && <p className="recipe-source">{source}</p>}
      </div>
      {notes && <p className="recipe-notes">{notes}</p>}
      {dateAdded && <p className="recipe-date">{dateAdded}</p>}
    </div>
  )
}
