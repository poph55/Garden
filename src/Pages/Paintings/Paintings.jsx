import { useState, useMemo } from 'react'
import { useGreedyColumns } from '../../hooks/useGreedyColumns'
import Layout from '../../components/Layout'
import PaintingEntry from './PaintingEntry'
import PaintingLightbox from './PaintingLightbox'
import paintbrushIcon from '../../assets/magic-paintbrush-Original.png'
import soriaMoria from './paintings/Far, far away Soria Moria Palace shimmered like Gold - Theodor Kittelsen.jpg'
import saintSebastian from './paintings/Saint Sebastian - Perugino.jpg'
import wanderer from './paintings/Wanderer Above the Sea of Fog - Casper David Friedrich.jpeg'
import refugeAndEternity from './paintings/REFUGE & ETERNITY - Philip Williams.webp'
import oathOfHoratii from './paintings/Oath of the Horatii - Jacques-Louis David.jpg'
import './Paintings.css'

const entries = [
  {
    title: 'Far, far away Soria Moria Palace shimmered like Gold',
    artist: 'Theodor Kittelsen',
    year: 1900,
    image: soriaMoria,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'Saint Sebastian',
    artist: 'Perugino',
    year: 1495,
    image: saintSebastian,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'Wanderer Above the Sea of Fog',
    artist: 'Caspar David Friedrich',
    year: 1818,
    image: wanderer,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'REFUGE & ETERNITY',
    artist: 'Philip Williams',
    year: 2024,
    image: refugeAndEternity,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'Oath of the Horatii',
    artist: 'Jacques-Louis David',
    year: 1785,
    image: oathOfHoratii,
    dateAdded: 'Apr 28, 2026',
  },
]

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
  const [lightboxIdx, setLightboxIdx] = useState(null)

  const sorted = useMemo(() => sortEntries(entries, sortBy), [sortBy])

  const openLightbox = idx => setLightboxIdx(idx)
  const closeLightbox = () => setLightboxIdx(null)
  const prevPainting = () => setLightboxIdx(i => (i - 1 + sorted.length) % sorted.length)
  const nextPainting = () => setLightboxIdx(i => (i + 1) % sorted.length)

  const { cols, registerWeight } = useGreedyColumns(sorted, 3)

  return (
    <Layout showBack>
      <div className="page-header">
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
      </div>

      <section className="paintings-list">
        <div className="container">
          <div className="paintings-columns">
            {cols.map((col, ci) => (
              <div key={ci} className="paintings-column">
                {col.map(({ entry, idx }) => (
                  <PaintingEntry
                    key={entry.title}
                    {...entry}
                    onImageClick={() => openLightbox(idx)}
                    onLoad={(w, h) => registerWeight(entry.title, h / w)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxIdx !== null && (
        <PaintingLightbox
          entries={sorted}
          idx={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevPainting}
          onNext={nextPainting}
        />
      )}
    </Layout>
  )
}
