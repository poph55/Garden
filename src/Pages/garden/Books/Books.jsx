import { useState, useMemo } from 'react'
import Layout from '../../../components/Layout'
import BookEntry from './BookEntry'
import bookshelfIcon from '../../../assets/optimized/bookshelf-Original.webp'
import bloodMeridian from './covers/blood meridian.png'
import tomorrowAndTomorrowAndTomorrow from './covers/tomorrow and tomorrow and tomorrow.jpg'
import snowsOfKilimanjaro from './covers/snows of kilimanjaro and other stories.jpg'
import loveTriangle from './covers/love triangle.jpg'
import bookOfLaughterAndForgetting from './covers/the book of laughter and forgetting.jpg'
import meditations from './covers/optimized/meditations.webp'
import notesFromUnderground from './covers/optimized/notes from underground.webp'
import './Books.css'

const entries = [
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    year: 180,
    cover: meditations,
    startDate: 'Aug 16, 2026',
    endDate: 'Aug 17, 2026',
    rating: 3,
    link: 'https://app.thestorygraph.com/books/5c0989bb-e324-476f-b7ba-46a74bc1cb7a',
  },
  {
    title: 'Notes from Underground',
    author: 'Fyodor Dostoevsky',
    year: 1864,
    cover: notesFromUnderground,
    startDate: 'Aug 17, 2026',
    endDate: 'Aug 17, 2026',
    rating: 4,
    link: 'https://app.thestorygraph.com/books/1dbb8c28-5e66-4d5d-ac9c-ca82d4029420',
  },
  {
    title: 'The Book of Laughter and Forgetting',
    author: 'Milan Kundera',
    year: 1979,
    cover: bookOfLaughterAndForgetting,
    startDate: 'May 13, 2026',
    endDate: 'May 19, 2026',
    rating: 4.5,
  },
  {
    title: 'Love Triangle',
    author: 'Matt Parker',
    year: 2024,
    cover: loveTriangle,
    startDate: 'Apr 22, 2026',
    endDate: 'May 13, 2026',
    rating: 2.5,
  },
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
      <div className="page-header">
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
      </div>

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
