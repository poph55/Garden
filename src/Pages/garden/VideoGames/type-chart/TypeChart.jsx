import { useState } from 'react'
import normalIcon   from '../pokemon-champions/type-icons/normal.png'
import fightingIcon from '../pokemon-champions/type-icons/fighting.png'
import flyingIcon   from '../pokemon-champions/type-icons/flying.png'
import poisonIcon   from '../pokemon-champions/type-icons/poison.png'
import groundIcon   from '../pokemon-champions/type-icons/ground.png'
import rockIcon     from '../pokemon-champions/type-icons/rock.png'
import bugIcon      from '../pokemon-champions/type-icons/bug.png'
import ghostIcon    from '../pokemon-champions/type-icons/ghost.png'
import steelIcon    from '../pokemon-champions/type-icons/steel.png'
import fireIcon     from '../pokemon-champions/type-icons/fire.png'
import waterIcon    from '../pokemon-champions/type-icons/water.png'
import grassIcon    from '../pokemon-champions/type-icons/grass.png'
import electricIcon from '../pokemon-champions/type-icons/electric.png'
import psychicIcon  from '../pokemon-champions/type-icons/psychic.png'
import iceIcon      from '../pokemon-champions/type-icons/ice.png'
import dragonIcon   from '../pokemon-champions/type-icons/dragon.png'
import darkIcon     from '../pokemon-champions/type-icons/dark.png'
import fairyIcon    from '../pokemon-champions/type-icons/fairy.png'

const TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
]

const TYPE_ICON = {
  Normal: normalIcon, Fire: fireIcon, Water: waterIcon,
  Electric: electricIcon, Grass: grassIcon, Ice: iceIcon,
  Fighting: fightingIcon, Poison: poisonIcon, Ground: groundIcon,
  Flying: flyingIcon, Psychic: psychicIcon, Bug: bugIcon,
  Rock: rockIcon, Ghost: ghostIcon, Dragon: dragonIcon,
  Dark: darkIcon, Steel: steelIcon, Fairy: fairyIcon,
}

// chart[attackerIndex][defenderIndex] = multiplier
const N = TYPES.length
const chart = Array.from({ length: N }, () => Array(N).fill(1))

const t = name => TYPES.indexOf(name)
const se  = (atk, ...defs) => defs.forEach(d => { chart[t(atk)][t(d)] = 2   })
const nve = (atk, ...defs) => defs.forEach(d => { chart[t(atk)][t(d)] = 0.5 })
const ne  = (atk, ...defs) => defs.forEach(d => { chart[t(atk)][t(d)] = 0   })

se ('Normal',   )
nve('Normal',   'Rock', 'Steel')
ne ('Normal',   'Ghost')

se ('Fire',     'Grass', 'Ice', 'Bug', 'Steel')
nve('Fire',     'Fire', 'Water', 'Rock', 'Dragon')

se ('Water',    'Fire', 'Ground', 'Rock')
nve('Water',    'Water', 'Grass', 'Dragon')

se ('Electric', 'Water', 'Flying')
nve('Electric', 'Electric', 'Grass', 'Dragon')
ne ('Electric', 'Ground')

se ('Grass',    'Water', 'Ground', 'Rock')
nve('Grass',    'Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel')

se ('Ice',      'Grass', 'Ground', 'Flying', 'Dragon')
nve('Ice',      'Fire', 'Water', 'Ice', 'Steel')

se ('Fighting', 'Normal', 'Ice', 'Rock', 'Dark', 'Steel')
nve('Fighting', 'Poison', 'Bug', 'Psychic', 'Flying', 'Fairy')
ne ('Fighting', 'Ghost')

se ('Poison',   'Grass', 'Fairy')
nve('Poison',   'Poison', 'Ground', 'Rock', 'Ghost')
ne ('Poison',   'Steel')

se ('Ground',   'Fire', 'Electric', 'Poison', 'Rock', 'Steel')
nve('Ground',   'Grass', 'Bug')
ne ('Ground',   'Flying')

se ('Flying',   'Grass', 'Fighting', 'Bug')
nve('Flying',   'Electric', 'Rock', 'Steel')

se ('Psychic',  'Fighting', 'Poison')
nve('Psychic',  'Psychic', 'Steel')
ne ('Psychic',  'Dark')

se ('Bug',      'Grass', 'Psychic', 'Dark')
nve('Bug',      'Fire', 'Fighting', 'Flying', 'Ghost', 'Steel', 'Fairy')

se ('Rock',     'Fire', 'Ice', 'Flying', 'Bug')
nve('Rock',     'Fighting', 'Ground', 'Steel')

se ('Ghost',    'Psychic', 'Ghost')
nve('Ghost',    'Dark')
ne ('Ghost',    'Normal')

se ('Dragon',   'Dragon')
nve('Dragon',   'Steel')
ne ('Dragon',   'Fairy')

se ('Dark',     'Psychic', 'Ghost')
nve('Dark',     'Fighting', 'Dark', 'Fairy')

se ('Steel',    'Ice', 'Rock', 'Fairy')
nve('Steel',    'Fire', 'Water', 'Electric', 'Steel')

se ('Fairy',    'Fighting', 'Dragon', 'Dark')
nve('Fairy',    'Fire', 'Poison', 'Steel')

function effectivenessLabel(val) {
  if (val === 0)    return '0×'
  if (val === 0.25) return '¼×'
  if (val === 0.5)  return '½×'
  if (val === 2)    return '2×'
  if (val === 4)    return '4×'
  return '1×'
}

function effectivenessClass(val) {
  if (val >= 2)  return 'tc-se'
  if (val === 0) return 'tc-immune'
  if (val < 1)   return 'tc-nve'
  return 'tc-neutral'
}

export default function TypeChart() {
  const [atkType, setAtkType]   = useState(null)
  const [defType1, setDefType1] = useState(null)
  const [defType2, setDefType2] = useState(null)

  function handleAtkClick(type) {
    setAtkType(prev => prev === type ? null : type)
  }

  function handleDefClick(type) {
    if (defType1 === type) {
      setDefType1(defType2 ?? null)
      setDefType2(null)
    } else if (defType2 === type) {
      setDefType2(null)
    } else if (!defType1) {
      setDefType1(type)
    } else if (!defType2) {
      setDefType2(type)
    } else {
      setDefType1(type)
      setDefType2(null)
    }
  }

  const result = (() => {
    if (!atkType || !defType1) return null
    const a = t(atkType)
    let val = chart[a][t(defType1)]
    if (defType2) val *= chart[a][t(defType2)]
    return val
  })()

  return (
    <div className="type-chart-layout">
      <div className="type-chart-scroll">
        <table className="type-chart">
          <thead>
            <tr>
              <th className="type-chart-corner" rowSpan={2}>ATK ↓</th>
              <th className="type-chart-def-label" colSpan={N}>Defending Type →</th>
            </tr>
            <tr>
              {TYPES.map(def => (
                <th
                  key={def}
                  className={`type-chart-col-header${defType1 === def || defType2 === def ? ' tc-col-header--active' : ''}`}
                  onClick={() => handleDefClick(def)}
                >
                  <img src={TYPE_ICON[def]} alt={def} className="tc-type-icon" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TYPES.map((atk, a) => (
              <tr key={atk} className={atk === atkType ? 'tc-row--active' : ''}>
                <th className="type-chart-row-header" onClick={() => handleAtkClick(atk)}>
                  <img src={TYPE_ICON[atk]} alt={atk} className="tc-type-icon" />
                </th>
                {TYPES.map((def, d) => {
                  const val = chart[a][d]
                  const cls =
                    val === 2   ? 'tc-se'      :
                    val === 0.5 ? 'tc-nve'     :
                    val === 0   ? 'tc-immune'  : 'tc-neutral'
                  const colActive = defType1 === def || defType2 === def
                  const label =
                    val === 2   ? '2'  :
                    val === 0.5 ? '½'  :
                    val === 0   ? '0'  : ''
                  return (
                    <td
                      key={def}
                      className={`tc-cell ${cls}${colActive ? ' tc-col-highlight' : ''}`}
                    >
                      {label}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="type-calc">
        <p className="type-calc-label">Attacking Type</p>
        <div className="type-calc-grid">
          {TYPES.map(type => (
            <button
              key={type}
              className={`type-calc-btn${atkType === type ? ' type-calc-btn--active' : ''}`}
              onClick={() => handleAtkClick(type)}
              title={type}
            >
              <img src={TYPE_ICON[type]} alt={type} className="tc-type-icon" />
            </button>
          ))}
        </div>

        <p className="type-calc-label">Defending Type</p>
        <div className="type-calc-selected-types">
          {[defType1, defType2].map((type, i) =>
            type
              ? <img key={i} src={TYPE_ICON[type]} alt={type} className="tc-type-icon" />
              : <span key={i} className="type-calc-slot-empty">—</span>
          )}
        </div>
        <div className="type-calc-grid">
          {TYPES.map(type => (
            <button
              key={type}
              className={`type-calc-btn${defType1 === type || defType2 === type ? ' type-calc-btn--active' : ''}`}
              onClick={() => handleDefClick(type)}
              title={type}
            >
              <img src={TYPE_ICON[type]} alt={type} className="tc-type-icon" />
            </button>
          ))}
        </div>

        <div className="type-calc-result">
          {result !== null ? (
            <span className={`type-calc-value ${effectivenessClass(result)}`}>
              {effectivenessLabel(result)}
            </span>
          ) : (
            <span className="type-calc-value tc-neutral">—</span>
          )}
          <span className="type-calc-result-label">effectiveness</span>
        </div>
      </div>
    </div>
  )
}
