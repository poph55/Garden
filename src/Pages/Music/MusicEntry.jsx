import { useState, useEffect } from 'react'
import defaultCover from './assets/record.png'
import musicNoteIcon from './assets/MusicNote.png'
import vinylRecordIcon from './assets/VinylRecord.png'

const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function MusicEntry({ cover, title, artist, notes, link, dateAdded = today, type = 'song' }) {
  const [resolvedCover, setResolvedCover] = useState(cover || defaultCover)

  useEffect(() => {
    if (cover || !link?.includes('spotify.com')) return
    fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(link)}`)
      .then(r => r.json())
      .then(data => { if (data.thumbnail_url) setResolvedCover(data.thumbnail_url) })
      .catch(() => {})
  }, [link, cover])

  const typeIcon = type === 'album' ? vinylRecordIcon : musicNoteIcon

  return (
    <div className="music-entry">
      <a href={link} target="_blank" rel="noreferrer" className="entry-cover-link">
        <div className="entry-cover-wrap">
          <img src={resolvedCover} alt={`${title} by ${artist}`} className="entry-cover" />
          <img src={typeIcon} alt={type} className="entry-type-icon" />
        </div>
      </a>
      <div className="entry-body">
        <a href={link} target="_blank" rel="noreferrer" className="entry-title">
          {title}
        </a>
        <p className="entry-artist">{artist}</p>
        <p className="entry-notes">{notes}</p>
        <p className="entry-date">{dateAdded}</p>
      </div>
    </div>
  )
}
