import { useState, useMemo } from 'react'
import { useGreedyColumns } from '../../hooks/useGreedyColumns'
import Layout from '../../components/Layout'
import PaintingEntry from './PaintingEntry'
import PaintingLightbox from './PaintingLightbox'
import paintbrushIcon from '../../assets/optimized/magic-paintbrush-Original.webp'
import soriaMoria from './paintings/optimized/Far, far away Soria Moria Palace shimmered like Gold - Theodor Kittelsen-full.webp'
import soriaMoriaThumb from './paintings/optimized/Far, far away Soria Moria Palace shimmered like Gold - Theodor Kittelsen-thumb.webp'
import saintSebastian from './paintings/optimized/Saint Sebastian - Perugino-full.webp'
import saintSebastianThumb from './paintings/optimized/Saint Sebastian - Perugino-thumb.webp'
import wanderer from './paintings/optimized/Wanderer Above the Sea of Fog - Casper David Friedrich-full.webp'
import wandererThumb from './paintings/optimized/Wanderer Above the Sea of Fog - Casper David Friedrich-thumb.webp'
import refugeAndEternity from './paintings/optimized/REFUGE & ETERNITY - Philip Williams-full.webp'
import refugeAndEternityThumb from './paintings/optimized/REFUGE & ETERNITY - Philip Williams-thumb.webp'
import oathOfHoratii from './paintings/optimized/Oath of the Horatii - Jacques-Louis David-full.webp'
import oathOfHoratiiThumb from './paintings/optimized/Oath of the Horatii - Jacques-Louis David-thumb.webp'
import stSebastianCrown from './paintings/optimized/St sebastian receives the crown and palm of martyrdom-full.webp'
import stSebastianCrownThumb from './paintings/optimized/St sebastian receives the crown and palm of martyrdom-thumb.webp'
import fright from './paintings/optimized/Fright - Phil Hale-full.webp'
import frightThumb from './paintings/optimized/Fright - Phil Hale-thumb.webp'
import './Paintings.css'

const entries = [
  {
    title: 'Far, far away Soria Moria Palace shimmered like Gold',
    artist: 'Theodor Kittelsen',
    year: 1900,
    image: soriaMoria,
    thumbnail: soriaMoriaThumb, width: 7546, height: 4955, aspectRatio: 0.6566,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'Saint Sebastian',
    artist: 'Perugino',
    year: 1495,
    image: saintSebastian,
    thumbnail: saintSebastianThumb, width: 2130, height: 3372, aspectRatio: 1.5831,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'Wanderer Above the Sea of Fog',
    artist: 'Caspar David Friedrich',
    year: 1818,
    image: wanderer,
    thumbnail: wandererThumb, width: 1920, height: 2463, aspectRatio: 1.2828,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'REFUGE & ETERNITY',
    artist: 'Philip Williams',
    year: 2024,
    image: refugeAndEternity,
    thumbnail: refugeAndEternityThumb, width: 1000, height: 1010, aspectRatio: 1.01,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'St. Sebastian Receives the Crown and Palm of Martyrdom',
    artist: 'Girolamo Siciolante',
    year: 1580,
    image: stSebastianCrown,
    thumbnail: stSebastianCrownThumb, width: 823, height: 1260, aspectRatio: 1.531,
    dateAdded: 'May 19, 2026',
  },
  {
    title: 'Oath of the Horatii',
    artist: 'Jacques-Louis David',
    year: 1785,
    image: oathOfHoratii,
    thumbnail: oathOfHoratiiThumb, width: 3840, height: 2978, aspectRatio: 0.7755,
    dateAdded: 'Apr 28, 2026',
  },
  {
    title: 'Fright',
    artist: 'Phil Hale',
    year: 2000,
    image: fright,
    thumbnail: frightThumb, width: 1708, height: 2374, aspectRatio: 1.3899,
    dateAdded: 'Jul 9, 2026',
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

  const { cols } = useGreedyColumns(sorted, 3)

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
