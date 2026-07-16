import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import PoetryEntry from './PoetryEntry'
import papyrusScrollIcon from '../../assets/optimized/papyrus-scroll-Original.webp'
import { useGreedyColumns } from '../../hooks/useGreedyColumns'
import './Poetry.css'

const entries = [
  {
    title: 'We Real Cool',
    author: 'Gwendolyn Brooks',
    year: 1960,
    poem: `THE POOL PLAYERS.
SEVEN AT THE GOLDEN SHOVEL.

We real cool. We
Left school. We

Lurk late. We
Strike straight. We

Sing sin. We
Thin gin. We

Jazz June. We
Die soon.`,
    dateAdded: 'May 19, 2026',
  },
  {
    title: 'This Is Just To Say',
    author: 'William Carlos Williams',
    year: 1938,
    poem: `I have eaten
the plums
that were in
the icebox

and which
you were probably
saving
for breakfast

Forgive me
they were delicious
so sweet
and so cold`,
    dateAdded: 'May 19, 2026',
  },
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
    if (by === 'year')   return (a.year ?? 0) - (b.year ?? 0)
    return new Date(b.dateAdded) - new Date(a.dateAdded)
  })
}

export default function Poetry() {
  const [sortBy, setSortBy] = useState('dateAdded')
  const sorted = useMemo(() => sortEntries(entries, sortBy), [sortBy])
  const { cols } = useGreedyColumns(sorted, 3)

  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title poetry-title">
            <img src={papyrusScrollIcon} alt="" className="poetry-title-icon" aria-hidden="true" />
            poetry
          </h1>
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="dateAdded">date added</option>
            <option value="author">author</option>
            <option value="title">title</option>
            <option value="year">year</option>
          </select>
        </div>
      </div>

      <section className="poetry-list">
        <div className="container">
          <div className="poetry-columns">
            {cols.map((col, ci) => (
              <div key={ci} className="poetry-column">
                {col.map(({ entry }) => (
                  <PoetryEntry key={entry.title} {...entry} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
