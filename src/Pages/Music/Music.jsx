import { useState } from 'react'
import Layout from '../../components/Layout'
import MusicEntry from './MusicEntry'
import cantBuyAThrillCover from './covers/Cant buy a thrill cover.jpg'
import bloodOnTheTracksCover from './covers/blood on the tracks.jpg'
import wishYouWereHereCover from './covers/wish you were here cover.jpg'
import './Music.css'

const entries = [
  {
    title: 'Only A Fool Would Say That',
    artist: 'Steely Dan',
    type: 'song',
    cover: cantBuyAThrillCover,
    notes: `a world become one\nof salads and sun\nonly a fool would say that\ntalkin' 'bout a world where all is free`,
    link: 'https://open.spotify.com/track/7GVvj4zJNVuBJSl6StEfn5',
    dateAdded: 'Apr 14, 2026',
  },
  {
    title: 'Wish You Were Here',
    artist: 'Pink Floyd',
    type: 'song',
    cover: wishYouWereHereCover,
    notes: `so you think you can tell\nheaven from hell,\n\ndid they get you to trade\nyour heroes for ghosts\n\nrunning over the same old\nground, what have we found?\nthe same old fears, wish you were here`,
    link: 'https://open.spotify.com/track/6mFkJmJqdDVQ1REhVfGgd1?si=b5bf9ca6920943ba',
    dateAdded: 'Apr 15, 2026',
  },
  {
    title: 'Blood On The Tracks',
    artist: 'Bob Dylan',
    type: 'album',
    cover: bloodOnTheTracksCover,
    link: 'https://open.spotify.com/album/4WD4pslu83FF6oMa1e19mF',
    dateAdded: 'Apr 15, 2026',
  },
].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))

export default function Music() {
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all' ? entries : entries.filter(e => e.type === filter)

  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">music</h1>
          <select
            className="filter-select"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">all</option>
            <option value="song">songs</option>
            <option value="album">albums</option>
          </select>
        </div>
      </section>

      <section className="entry-list">
        <div className="container">
          {visible.map((entry, i) => (
            <MusicEntry key={i} {...entry} />
          ))}
        </div>
      </section>
    </Layout>
  )
}
