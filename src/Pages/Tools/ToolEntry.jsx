import pliersIcon from './assets/diagonal-pliers-Original.png'

export default function ToolEntry({ title, link, description, dateAdded, image }) {
  return (
    <div className="tool-entry">
      {image && (
        <a href={link} target="_blank" rel="noreferrer" className="tool-image-wrap">
          <img src={image} alt={title} className="tool-image" />
          <img src={pliersIcon} alt="tool" className="tool-type-icon" />
        </a>
      )}
      {!image && (
        <div className="tool-icon-only">
          <img src={pliersIcon} alt="tool" className="tool-type-icon tool-type-icon--solo" />
        </div>
      )}
      <div className="tool-body">
        <a href={link} target="_blank" rel="noreferrer" className="tool-title">
          {title}
        </a>
        <p className="tool-description">{description}</p>
        {dateAdded && <p className="tool-date">{dateAdded}</p>}
      </div>
    </div>
  )
}
