export default function ToolEntry({ title, link, description, dateAdded, image }) {
  return (
    <div className="tool-entry">
      {image && (
        <a href={link} target="_blank" rel="noreferrer" className="tool-image-wrap">
          <img src={image} alt={title} className="tool-image" />
        </a>
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
