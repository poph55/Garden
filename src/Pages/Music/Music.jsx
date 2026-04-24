import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import MusicEntry from './MusicEntry'
import musicBoxIcon from '../../assets/music-storage-box-Original.png'
import cantBuyAThrillCover from './covers/Cant buy a thrill cover.jpg'
import bloodOnTheTracksCover from './covers/blood on the tracks.jpg'
import wishYouWereHereCover from './covers/wish you were here cover.jpg'
import ds2Cover from './covers/ds2.jpg'
import dillardAndClarkCover from './covers/dillard and clark.jpg'
import loversRockCover from './covers/lovers rock.jpg'
import freewheelinCover from './covers/the freewheelin bob dylan.jpg'
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
  {
    title: "Don't Think Twice, It's Alright",
    artist: 'Bob Dylan',
    type: 'song',
    cover: freewheelinCover,
    notes: `And it ain't no use to sit and wonder why, babe\nIt'll never do somehow\n\nBut don't think twice, it's all right`,
    link: 'https://open.spotify.com/track/2WOjLF83vqjit2Zh4B69V3?si=c4fb003701a0485c',
    dateAdded: 'Apr 24, 2026',
  },
  {
    title: "Don't Let Me Down",
    artist: 'Dillard & Clark',
    type: 'song',
    cover: dillardAndClarkCover,
    link: 'https://open.spotify.com/track/1PsDNPG1j7ySpFpxjHB5xb?si=f5e7a6ea8e974801',
    dateAdded: 'Apr 24, 2026',
  },
  {
    title: 'By Your Side',
    artist: 'Sade',
    type: 'song',
    cover: loversRockCover,
    link: 'https://open.spotify.com/track/7H3ojI1BsVy0dEJENqMt1k?si=94874a7a999849af',
    dateAdded: 'Apr 24, 2026',
  },
  {
    title: 'The Percocet & Stripper Joint',
    artist: 'Future',
    type: 'song',
    cover: ds2Cover,
link: 'https://open.spotify.com/track/1yCVsVH2hQ72SxNI8QTDaB?si=57f7396f0c90458b',
    dateAdded: 'Apr 24, 2026',
  },
].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))

export default function Music() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dateAdded')

  const visible = useMemo(() => {
    const filtered = filter === 'all' ? entries : entries.filter(e => e.type === filter)
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name')   return a.title.localeCompare(b.title)
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist)
      return new Date(b.dateAdded) - new Date(a.dateAdded)
    })
  }, [filter, sortBy])

  const NUM_COLS = 3
  const cols = Array.from({ length: NUM_COLS }, () => [])
  visible.forEach((entry, i) => cols[i % NUM_COLS].push(entry))

  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title music-title">
            <img src={musicBoxIcon} alt="" className="music-title-icon" aria-hidden="true" />
            music
          </h1>
          <div className="music-selects">
            <select
              className="filter-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">all</option>
              <option value="song">songs</option>
              <option value="album">albums</option>
            </select>
            <select
              className="filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="dateAdded">date added</option>
              <option value="name">name</option>
              <option value="artist">artist</option>
            </select>
          </div>
        </div>
      </section>

      <section className="entry-list">
        <div className="container">
          <div className="music-columns">
            {cols.map((col, ci) => (
              <div key={ci} className="music-column">
                {col.map((entry, i) => <MusicEntry key={i} {...entry} />)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
