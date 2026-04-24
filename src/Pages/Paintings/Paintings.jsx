import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import PaintingEntry from './PaintingEntry'
import paintbrushIcon from '../../assets/magic-paintbrush-Original.png'
import './Paintings.css'

const entries = []

function sortEntries(list, by) {
  return [...list].sort((a, b) => {
    if (by === 'title')  return a.title.localeCompare(b.title)
    if (by === 'artist') return a.artist.split(' ').pop().localeCompare(b.artist.split(' ').pop())
    if (by === 'year')   return (a.year ?? 0) - (b.year ?? 0)
    return new Date(b.dateAdded) - new Date(a.dateAdded)
  })
}

export default function Paintings() {
  const [sortBy, setSortBy] = useState('dateAdded')
  const sorted = useMemo(() => sortEntries(entries, sortBy), [sortBy])

  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title paintings-title">
            <img src={paintbrushIcon} alt="" className="paintings-title-icon" aria-hidden="true" />
            paintings
          </h1>
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="dateAdded">date added</option>
            <option value="artist">artist</option>
            <option value="title">title</option>
            <option value="year">year</option>
          </select>
        </div>
      </section>

      <section className="paintings-list">
        <div className="container">
          {sorted.map((entry, i) => (
            <PaintingEntry key={i} {...entry} />
          ))}
        </div>
      </section>
    </Layout>
  )
}
