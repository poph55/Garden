import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import BookEntry from './BookEntry'
import bookshelfIcon from '../../assets/bookshelf-Original.png'
import bloodMeridian from './covers/blood meridian.png'
import tomorrowAndTomorrowAndTomorrow from './covers/tomorrow and tomorrow and tomorrow.jpg'
import snowsOfKilimanjaro from './covers/snows of kilimanjaro and other stories.jpg'
import './Books.css'

const entries = [
  {
    title: 'The Snows of Kilimanjaro and Other Stories',
    author: 'Ernest Hemingway',
    year: 1936,
    cover: snowsOfKilimanjaro,
    startDate: 'Apr 7, 2026',
    endDate: 'Apr 7, 2026',
    rating: 3.5,
    vocabFolder: 'The Snows of Kilimanjaro and Other Stories',
  },
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    year: 2022,
    cover: tomorrowAndTomorrowAndTomorrow,
    startDate: 'Apr 7, 2026',
    endDate: 'Apr 22, 2026',
    rating: 2.5,
    vocabFolder: 'Tomorrow, and Tomorrow, and Tomorrow',
  },
  {
    title: 'Blood Meridian',
    author: 'Cormac McCarthy',
    year: 1985,
    cover: bloodMeridian,
    startDate: 'Mar 10, 2026',
    endDate: 'Apr 7, 2026',
    rating: 5,
    vocabFolder: 'Blood Meridian',
  },
]

function sortEntries(list, by) {
  return [...list].sort((a, b) => {
    if (by === 'title')  return a.title.localeCompare(b.title)
    if (by === 'author') {
      const lastName = name => (name || '').split(' ').pop()
      return lastName(a.author).localeCompare(lastName(b.author))
    }
    if (by === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
    return new Date(b.endDate || b.startDate || 0) - new Date(a.endDate || a.startDate || 0)
  })
}

export default function Books() {
  const [sortBy, setSortBy] = useState('endDate')

  const sorted = useMemo(() => sortEntries(entries, sortBy), [sortBy])

  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title books-title">
            <img src={bookshelfIcon} alt="" className="books-title-icon" aria-hidden="true" />
            books
          </h1>
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="endDate">date finished</option>
            <option value="title">title</option>
            <option value="author">author</option>
            <option value="rating">rating</option>
          </select>
        </div>
      </section>

      <section className="book-list">
        <div className="container">
          <div className="book-grid">
            {sorted.map(entry => (
              <BookEntry key={entry.title} {...entry} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
