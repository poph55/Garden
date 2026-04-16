import { useState } from 'react'
import Layout from '../../components/Layout'
import backIcon from '../../assets/back-image-Original.png'
import ToolEntry from './ToolEntry'
import FolderEntry from './FolderEntry'
import piixes from './screenshots/piixes.jpg'
import bgremover from './screenshots/bgremover.png'
import fileconverter from './screenshots/fileconverter.png'
import albumcovers from './screenshots/albumcovers.png'
import './Tools.css'

const root = [
  {
    type: 'folder',
    title: 'file editing',
    children: [
      {
        type: 'tool',
        title: 'AI background remover',
        link: 'https://fileconv.online/remove-bg',
        description: 'fileconv.online/remove-bg',
        dateAdded: 'Apr 15, 2026',
        image: bgremover,
      },
      {
        type: 'tool',
        title: 'universal file converter',
        link: 'https://cloudconvert.com',
        description: 'cloudconvert.com',
        dateAdded: 'Apr 15, 2026',
        image: fileconverter,
      },
    ],
  },
  {
    type: 'folder',
    title: 'assets',
    children: [
      {
        type: 'tool',
        title: '15k pixel icons',
        link: 'https://piixes.com',
        description: 'piixes.com',
        dateAdded: 'Apr 15, 2026',
        image: piixes,
      },
      {
        type: 'tool',
        title: 'hi-res album covers',
        link: 'https://covers.musichoarders.xyz',
        description: 'covers.musichoarders.xyz',
        dateAdded: 'Apr 15, 2026',
        image: albumcovers,
      },
    ],
  },
]

function getEntriesAtPath(tree, path) {
  let current = tree
  for (const name of path) {
    const folder = current.find(e => e.type === 'folder' && e.title === name)
    if (!folder) return []
    current = folder.children
  }
  return [...current].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1
    if (a.type !== 'folder' && b.type === 'folder') return 1
    if (a.dateAdded && b.dateAdded) return new Date(b.dateAdded) - new Date(a.dateAdded)
    return 0
  })
}

export default function Tools() {
  const [path, setPath] = useState([])

  const visible = getEntriesAtPath(root, path)

  return (
    <Layout showBack>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">tools</h1>
        </div>
      </section>

      <section className="tools-list">
        <div className="container">
          <nav className="tools-path">
            <button
              className="path-back"
              onClick={() => setPath(path.slice(0, -1))}
              aria-label="Go up one level"
              style={{ visibility: path.length > 0 ? 'visible' : 'hidden' }}
            >
              <img src={backIcon} alt="back" />
            </button>
            <button className="path-segment" onClick={() => setPath([])}>tools</button>
            {path.map((name, i) => (
              <span key={i} className="path-segment-wrap">
                <span className="path-sep">/</span>
                <button className="path-segment" onClick={() => setPath(path.slice(0, i + 1))}>
                  {name}
                </button>
              </span>
            ))}
            <span className="path-arrow-fill" aria-hidden>
              <span className="path-arrow-chevron">&lt;&lt;&lt;</span>
              <span className="path-arrow-line" />
            </span>
            <span className="path-current">current location</span>
          </nav>

          {visible.map((entry, i) =>
            entry.type === 'folder'
              ? <FolderEntry key={i} title={entry.title} onOpen={() => setPath([...path, entry.title])} />
              : <ToolEntry key={i} {...entry} />
          )}
        </div>
      </section>
    </Layout>
  )
}
