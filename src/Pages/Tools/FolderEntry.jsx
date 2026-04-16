import folderIcon from './assets/file-folder-2-Original.png'

export default function FolderEntry({ title, onOpen }) {
  return (
    <div className="folder-entry" onClick={onOpen}>
      <img src={folderIcon} alt="folder" className="folder-icon" />
      <span className="folder-title">{title}</span>
    </div>
  )
}
