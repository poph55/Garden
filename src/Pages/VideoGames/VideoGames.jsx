import { useState } from 'react'
import Layout from '../../components/Layout'
import PokemonChampions from './pokemon-champions/PokemonChampions'
import TypeChart from './type-chart/TypeChart'
import videoGameIcon from '../../assets/videogame-icon-Original.png'
import './VideoGames.css'

const TABS = [
  { id: 'pokemon-champions', label: 'pokemon champions' },
  { id: 'type-chart',        label: 'pokemon type chart' },
]

export default function VideoGames() {
  const [activeTab, setActiveTab] = useState('pokemon-champions')

  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title videogames-title">
            <img src={videoGameIcon} alt="" className="videogames-title-icon" aria-hidden="true" />
            video games
          </h1>
          <div className="vg-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`vg-tab${activeTab === tab.id ? ' vg-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'pokemon-champions' && (
        <section className="vg-list">
          <div className="container">
            <PokemonChampions />
          </div>
        </section>
      )}

      {activeTab === 'type-chart' && (
        <section className="vg-list">
          <div className="container">
            <TypeChart />
          </div>
        </section>
      )}
    </Layout>
  )
}
