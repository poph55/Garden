import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import PoetryEntry from './PoetryEntry'
import './Poetry.css'

const entries = [
  {
    title: 'blessing the boats',
    author: 'Lucille Clifton',
    poem: `may the tide
that is entering even now
the lip of our understanding
carry you out
beyond the face of fear
may you kiss
the wind then turn from it
certain that it will
love your back     may you
open your eyes to water
water waving forever
and may you in your innocence
sail through this to that`,
    dateAdded: 'Apr 22, 2026',
  },
]

function sortEntries(list, by) {
  return [...list].sort((a, b) => {
    if (by === 'title')  return a.title.localeCompare(b.title)
    if (by === 'author') return a.author.split(' ').pop().localeCompare(b.author.split(' ').pop())
    return new Date(b.dateAdded) - new Date(a.dateAdded)
  })
}

export default function Poetry() {
  const [sortBy, setSortBy] = useState('dateAdded')
  const sorted = useMemo(() => sortEntries(entries, sortBy), [sortBy])

  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">poetry</h1>
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="dateAdded">date added</option>
            <option value="author">author</option>
            <option value="title">title</option>
          </select>
        </div>
      </section>

      <section className="poetry-list">
        <div className="container">
          {sorted.map((entry, i) => (
            <PoetryEntry key={i} {...entry} />
          ))}
        </div>
      </section>
    </Layout>
  )
}
