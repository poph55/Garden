import { useState } from 'react'
import Layout from '../../components/Layout'
import GameEntry from './game-log/GameEntry'
import TeamsGrid from './teams/TeamsGrid'
import baseballFieldIcon from '../../assets/baseball-field-Original.png'
import nyyIcon from './team icons/NYY.png'
import bosIcon from './team icons/BOS.png'
import balIcon from './team icons/BAL.png'
import torIcon from './team icons/TOR.png'
import tbIcon  from './team icons/TB.png'
import cleIcon from './team icons/CLE.png'
import cwsIcon from './team icons/CWS.png'
import detIcon from './team icons/DET.png'
import kcIcon  from './team icons/KC.png'
import minIcon from './team icons/MIN.png'
import houIcon from './team icons/HOU.png'
import laaIcon from './team icons/LAA.png'
import seaIcon from './team icons/SEA.png'
import texIcon from './team icons/TEX.png'
import athIcon from './team icons/ATH.png'
import nymIcon from './team icons/NYM.png'
import atlIcon from './team icons/ATL.png'
import phiIcon from './team icons/PHI.png'
import wshIcon from './team icons/WSH.png'
import miaIcon from './team icons/MIA.png'
import chcIcon from './team icons/CHC.png'
import stlIcon from './team icons/STL.png'
import milIcon from './team icons/MIL.png'
import pitIcon from './team icons/PIT.png'
import cinIcon from './team icons/CIN.png'
import ladIcon from './team icons/LAD.png'
import sfIcon  from './team icons/SF.png'
import sdIcon  from './team icons/SD.png'
import azIcon  from './team icons/AZ.png'
import colIcon from './team icons/COL.png'
import './Baseball.css'

const icon = {
  Yankees:       nyyIcon,
  'Red Sox':     bosIcon,
  Orioles:       balIcon,
  'Blue Jays':   torIcon,
  Rays:          tbIcon,
  Guardians:     cleIcon,
  'White Sox':   cwsIcon,
  Tigers:        detIcon,
  Royals:        kcIcon,
  Twins:         minIcon,
  Astros:        houIcon,
  Angels:        laaIcon,
  Mariners:      seaIcon,
  Rangers:       texIcon,
  Athletics:     athIcon,
  Mets:          nymIcon,
  Braves:        atlIcon,
  Phillies:      phiIcon,
  Nationals:     wshIcon,
  Marlins:       miaIcon,
  Cubs:          chcIcon,
  Cardinals:     stlIcon,
  Brewers:       milIcon,
  Pirates:       pitIcon,
  Reds:          cinIcon,
  Dodgers:       ladIcon,
  Giants:        sfIcon,
  Padres:        sdIcon,
  Diamondbacks:  azIcon,
  Rockies:       colIcon,
}

const divisions = [
  ['Yankees', 'Red Sox', 'Orioles', 'Blue Jays', 'Rays'],
  ['Guardians', 'White Sox', 'Tigers', 'Royals', 'Twins'],
  ['Astros', 'Angels', 'Mariners', 'Rangers', 'Athletics'],
  ['Mets', 'Braves', 'Phillies', 'Nationals', 'Marlins'],
  ['Cubs', 'Cardinals', 'Brewers', 'Pirates', 'Reds'],
  ['Dodgers', 'Giants', 'Padres', 'Diamondbacks', 'Rockies'],
]

const abbr = {
  Yankees:     'NYY',
  Angels:      'LAA',
  Marlins:     'MIA',
  'Red Sox':   'BOS',
  Orioles:     'BAL',
  'White Sox': 'CWS',
  Astros:      'HOU',
  Cubs:        'CHC',
  Guardians:   'CLE',
  Pirates:     'PIT',
  Padres:      'SD',
  Giants:      'SF',
  Dodgers:     'LAD',
  Cardinals:   'STL',
  Mets:        'NYM',
  Nationals:   'WSH',
  Phillies:    'PHI',
  Twins:       'MIN',
}

function i(team) { return icon[team] ?? null }

const games = [
  { homeTeam: 'Yankees', homeScore: 11, awayTeam: 'Angels',    awayScore: 10, location: 'Yankee Stadium',  homeWin: true,  date: 'Apr 13, 2026' },
  { homeTeam: 'Yankees', homeScore: 8,  awayTeam: 'Marlins',   awayScore: 2,  location: 'Yankee Stadium',  homeWin: true,  date: 'Apr 3, 2026'  },
  { homeTeam: 'Yankees', homeScore: 4,  awayTeam: 'Red Sox',   awayScore: 3,  location: 'Yankee Stadium',  homeWin: true,  date: 'Oct 1, 2025',  tag: 'playoffs' },
  { homeTeam: 'Yankees', homeScore: 6,  awayTeam: 'Orioles',   awayScore: 1,  location: 'Yankee Stadium',  homeWin: true,  date: 'Sep 27, 2025' },
  { homeTeam: 'Yankees', homeScore: 5,  awayTeam: 'White Sox', awayScore: 3,  location: 'Yankee Stadium',  homeWin: true,  date: 'Sep 25, 2025' },
  { homeTeam: 'Yankees', homeScore: 8,  awayTeam: 'White Sox', awayScore: 1,  location: 'Yankee Stadium',  homeWin: true,  date: 'Sep 24, 2025' },
  { homeTeam: 'Yankees', homeScore: 3,  awayTeam: 'Astros',    awayScore: 5,  location: 'Yankee Stadium',  homeWin: false, date: 'Aug 8, 2025'  },
  { homeTeam: 'Yankees', homeScore: 11, awayTeam: 'Cubs',      awayScore: 0,  location: 'Yankee Stadium',  homeWin: true,  date: 'Jul 11, 2025' },
  { homeTeam: 'Yankees', homeScore: 9,  awayTeam: 'Orioles',   awayScore: 0,  location: 'Yankee Stadium',  homeWin: true,  date: 'Jun 21, 2025' },
  { homeTeam: 'Yankees', homeScore: 3,  awayTeam: 'Orioles',   awayScore: 5,  location: 'Yankee Stadium',  homeWin: false, date: 'Jun 20, 2025' },
  { homeTeam: 'Yankees', homeScore: 7,  awayTeam: 'Red Sox',   awayScore: 10, location: 'Yankee Stadium',  homeWin: false, date: 'Jun 7, 2025'  },
  { homeTeam: 'Yankees', homeScore: 4,  awayTeam: 'Guardians', awayScore: 0,  location: 'Yankee Stadium',  homeWin: true,  date: 'Jun 5, 2025'  },
  { homeTeam: 'Yankees', homeScore: 0,  awayTeam: 'Guardians', awayScore: 4,  location: 'Yankee Stadium',  homeWin: false, date: 'Jun 4, 2025'  },
  { homeTeam: 'Mets',    homeScore: 4,  awayTeam: 'Pirates',   awayScore: 3,  location: 'Citi Field',      homeWin: true,  date: 'May 12, 2025' },
  { homeTeam: 'Yankees', homeScore: 4,  awayTeam: 'Padres',    awayScore: 3,  location: 'Yankee Stadium',  homeWin: true,  date: 'May 7, 2025'  },
  { homeTeam: 'Yankees', homeScore: 4,  awayTeam: 'Giants',    awayScore: 5,  location: 'Yankee Stadium',  homeWin: false, date: 'Apr 13, 2025' },
  { homeTeam: 'Yankees', homeScore: 2,  awayTeam: 'Dodgers',   awayScore: 4,  location: 'Yankee Stadium',  homeWin: false, date: 'Oct 28, 2024', tag: 'world-series' },
  { homeTeam: 'Yankees', homeScore: 5,  awayTeam: 'Guardians', awayScore: 2,  location: 'Yankee Stadium',  homeWin: true,  date: 'Oct 14, 2024', tag: 'playoffs' },
  { homeTeam: 'Yankees', homeScore: 5,  awayTeam: 'Red Sox',   awayScore: 4,  location: 'Yankee Stadium',  homeWin: true,  date: 'Sep 13, 2024' },
  { homeTeam: 'Yankees', homeScore: 5,  awayTeam: 'Cardinals', awayScore: 6,  location: 'Yankee Stadium',  homeWin: false, date: 'Aug 31, 2024' },
  { homeTeam: 'Yankees', homeScore: 8,  awayTeam: 'Guardians', awayScore: 1,  location: 'Yankee Stadium',  homeWin: true,  date: 'Aug 21, 2024' },
  { homeTeam: 'Mets',    homeScore: 3,  awayTeam: 'Marlins',   awayScore: 2,  location: 'Citi Field',      homeWin: true,  date: 'Jun 13, 2024' },
  { homeTeam: 'Yankees', homeScore: 2,  awayTeam: 'Marlins',   awayScore: 5,  location: 'Yankee Stadium',  homeWin: false, date: 'Apr 10, 2024' },
  { homeTeam: 'Mets',    homeScore: 3,  awayTeam: 'Angels',    awayScore: 2,  location: 'Citi Field',      homeWin: true,  date: 'Aug 27, 2023' },
  { homeTeam: 'Yankees', homeScore: 4,  awayTeam: 'Cubs',      awayScore: 7,  location: 'Yankee Stadium',  homeWin: false, date: 'Jul 9, 2023'  },
  { homeTeam: 'Yankees', homeScore: 1,  awayTeam: 'Orioles',   awayScore: 14, location: 'Yankee Stadium',  homeWin: false, date: 'Jul 6, 2023'  },
  { homeTeam: 'Nationals', homeScore: 6, awayTeam: 'Phillies', awayScore: 7,  location: 'Nationals Park',  homeWin: false, date: 'Aug 5, 2021'  },
  { homeTeam: 'Nationals', homeScore: 9, awayTeam: 'Marlins',  awayScore: 3,  location: 'Nationals Park',  homeWin: true,  date: 'Sep 1, 2019'  },
  { homeTeam: 'Marlins', homeScore: 4,  awayTeam: 'Twins',     awayScore: 7,  location: 'Marlins Park',    homeWin: false, date: 'Jul 31, 2019' },
].map(g => ({ ...g, homeIcon: i(g.homeTeam), awayIcon: i(g.awayTeam), homeAbbr: abbr[g.homeTeam], awayAbbr: abbr[g.awayTeam] }))

const TABS = [
  { id: 'game-log', label: 'game log' },
  { id: 'teams',    label: 'teams' },
]

export default function Baseball() {
  const [activeTab, setActiveTab] = useState('game-log')
  const [visibilityMode, setVisibilityMode] = useState('played')

  return (
    <Layout showBack>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title baseball-title">
            <img src={baseballFieldIcon} alt="" className="baseball-title-icon" aria-hidden="true" />
            baseball
          </h1>
          <div className="baseball-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`baseball-tab${activeTab === tab.id ? ' baseball-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === 'teams' && (
            <div className="teams-visibility-toggle">
              <button
                className={`visibility-btn${visibilityMode === 'played' ? ' visibility-btn--active' : ''}`}
                onClick={() => setVisibilityMode('played')}
              >
                seen play
              </button>
              <button
                className={`visibility-btn${visibilityMode === 'home' ? ' visibility-btn--active' : ''}`}
                onClick={() => setVisibilityMode('home')}
              >
                home stadium
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'game-log' && (
        <section className="baseball-list">
          <div className="container">
            <div className="game-log">
              {Object.entries(
                games.reduce((acc, game) => {
                  const year = new Date(game.date).getFullYear()
                  ;(acc[year] ??= []).push(game)
                  return acc
                }, {})
              )
                .sort(([a], [b]) => b - a)
                .map(([year, yearGames]) => (
                  <div key={year} className="season-group">
                    <div className="season-divider">
                      <span className="season-year">{year}</span>
                      <span className="season-count">{yearGames.length} {yearGames.length === 1 ? 'game' : 'games'}</span>
                      <span className="season-line" />
                    </div>
                    <div className="game-grid">
                      {yearGames.map((game, i) => (
                        <GameEntry key={i} {...game} />
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      )}

      {activeTab === 'teams' && (
        <section className="baseball-list">
          <div className="container">
            <TeamsGrid divisions={divisions} icon={icon} games={games} visibilityMode={visibilityMode} />
          </div>
        </section>
      )}
    </Layout>
  )
}
