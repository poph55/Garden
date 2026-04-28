import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import QuoteEntry from './QuoteEntry'
import quotationMarksIcon from '../../assets/quotation-marks-Original.png'
import './Quotes.css'

const entries = [
  {
    content: `There were two "Reigns of Terror," if we would but remember it and consider it; the one wrought murder in hot passion, the other in heartless cold blood; the one lasted mere months, the other had lasted a thousand years; the one inflicted death upon ten thousand persons, the other upon a hundred millions; but our shudders are all for the "horrors" of the minor Terror, the momentary Terror, so to speak; whereas, what is the horror of swift death by the axe, compared with lifelong death from hunger, cold, insult, cruelty, and heart-break? What is swift death by lightning compared with death by slow fire at the stake? A city cemetery could contain the coffins filled by that brief Terror which we have all been so diligently taught to shiver at and mourn over; but all France could hardly contain the coffins filled by that older and real Terror—that unspeakably bitter and awful Terror which none of us has been taught to see in its vastness or pity as it deserves.`,
    person: 'Mark Twain',
    source: 'A Connecticut Yankee in King Arthur\'s Court',
    dateAdded: 'Apr 24, 2026',
  },
]

function sortEntries(list, by) {
  return [...list].sort((a, b) => {
    if (by === 'person') return a.person.split(' ').pop().localeCompare(b.person.split(' ').pop())
    return new Date(b.dateAdded) - new Date(a.dateAdded)
  })
}

export default function Quotes() {
  const [sortBy, setSortBy] = useState('dateAdded')
  const sorted = useMemo(() => sortEntries(entries, sortBy), [sortBy])

  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title quotes-title">
            <img src={quotationMarksIcon} alt="" className="quotes-title-icon" aria-hidden="true" />
            quotes
          </h1>
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="dateAdded">date added</option>
            <option value="person">person</option>
          </select>
        </div>
      </div>

      <section className="quotes-list">
        <div className="container">
          {sorted.map((entry, i) => (
            <QuoteEntry key={i} {...entry} />
          ))}
        </div>
      </section>
    </Layout>
  )
}
