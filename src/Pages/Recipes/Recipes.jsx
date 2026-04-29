import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import RecipeEntry from './RecipeEntry'
import casseroleIcon from '../../assets/casserole-dish-2-Original.png'
import './Recipes.css'

const entries = []

function sortEntries(list, by) {
  return [...list].sort((a, b) => {
    if (by === 'title')    return a.title.localeCompare(b.title)
    if (by === 'category') return a.category.localeCompare(b.category)
    return new Date(b.dateAdded) - new Date(a.dateAdded)
  })
}

export default function Recipes() {
  const [sortBy, setSortBy] = useState('dateAdded')
  const sorted = useMemo(() => sortEntries(entries, sortBy), [sortBy])

  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title recipes-title">
            <img src={casseroleIcon} alt="" className="recipes-title-icon" aria-hidden="true" />
            recipes
          </h1>
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="dateAdded">date added</option>
            <option value="title">title</option>
            <option value="category">category</option>
          </select>
        </div>
      </div>

      <section className="recipes-list">
        <div className="container">
          {sorted.map((entry, i) => (
            <RecipeEntry key={i} {...entry} />
          ))}
        </div>
      </section>
    </Layout>
  )
}
