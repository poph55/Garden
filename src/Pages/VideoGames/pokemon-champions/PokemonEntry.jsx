import physicalIcon from './type-icons/physical_move_icon.png'
import specialIcon  from './type-icons/special_move_icon.png'
import statusIcon   from './type-icons/status_move_icon.png'

import normalIcon   from './type-icons/normal.png'
import fightingIcon from './type-icons/fighting.png'
import flyingIcon   from './type-icons/flying.png'
import poisonIcon   from './type-icons/poison.png'
import groundIcon   from './type-icons/ground.png'
import rockIcon     from './type-icons/rock.png'
import bugIcon      from './type-icons/bug.png'
import ghostIcon    from './type-icons/ghost.png'
import steelIcon    from './type-icons/steel.png'
import fireIcon     from './type-icons/fire.png'
import waterIcon    from './type-icons/water.png'
import grassIcon    from './type-icons/grass.png'
import electricIcon from './type-icons/electric.png'
import psychicIcon  from './type-icons/psychic.png'
import iceIcon      from './type-icons/ice.png'
import dragonIcon   from './type-icons/dragon.png'
import darkIcon     from './type-icons/dark.png'
import fairyIcon    from './type-icons/fairy.png'

const CATEGORY_ICON = {
  Physical: physicalIcon,
  Special:  specialIcon,
  Status:   statusIcon,
}

const TYPE_ICON = {
  Normal:   normalIcon,   Fighting: fightingIcon, Flying:   flyingIcon,
  Poison:   poisonIcon,   Ground:   groundIcon,   Rock:     rockIcon,
  Bug:      bugIcon,      Ghost:    ghostIcon,    Steel:    steelIcon,
  Fire:     fireIcon,     Water:    waterIcon,    Grass:    grassIcon,
  Electric: electricIcon, Psychic:  psychicIcon,  Ice:      iceIcon,
  Dragon:   dragonIcon,   Dark:     darkIcon,     Fairy:    fairyIcon,
}

const STATS = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']

// Indices: HP=0 Atk=1 Def=2 SpA=3 SpD=4 Spe=5
const NATURE_MODIFIERS = {
  Hardy:   { plus: null, minus: null },
  Lonely:  { plus: 1,    minus: 2    },
  Brave:   { plus: 1,    minus: 5    },
  Adamant: { plus: 1,    minus: 3    },
  Naughty: { plus: 1,    minus: 4    },
  Bold:    { plus: 2,    minus: 1    },
  Docile:  { plus: null, minus: null },
  Relaxed: { plus: 2,    minus: 5    },
  Impish:  { plus: 2,    minus: 3    },
  Lax:     { plus: 2,    minus: 4    },
  Timid:   { plus: 5,    minus: 1    },
  Hasty:   { plus: 5,    minus: 2    },
  Serious: { plus: null, minus: null },
  Jolly:   { plus: 5,    minus: 3    },
  Naive:   { plus: 5,    minus: 4    },
  Modest:  { plus: 3,    minus: 1    },
  Mild:    { plus: 3,    minus: 2    },
  Quiet:   { plus: 3,    minus: 5    },
  Bashful: { plus: null, minus: null },
  Rash:    { plus: 3,    minus: 4    },
  Calm:    { plus: 4,    minus: 1    },
  Gentle:  { plus: 4,    minus: 2    },
  Sassy:   { plus: 4,    minus: 5    },
  Careful: { plus: 4,    minus: 3    },
  Quirky:  { plus: null, minus: null },
}

const MOVE_EFFECTS = {
  'Electro Shot':     { power: 130, category: 'Special',  effect: 'Absorbs electricity in one turn, fires in the next. Raises Sp. Atk. Fires in one turn under rain.' },
  'Flash Cannon':     { power: 80,  category: 'Special',  effect: 'May lower the target\'s Sp. Def.' },
  'Draco Meteor':     { power: 130, category: 'Special',  effect: 'Sharply lowers user\'s Sp. Atk after use.' },
  'Protect':          { power: null, category: 'Status',  effect: 'Protects the user from all moves that turn. Fails if used consecutively.' },
  'Hurricane':        { power: 110, category: 'Special',  effect: 'Hits without accuracy check in rain. May confuse the target.' },
  'Tailwind':         { power: null, category: 'Status',  effect: 'Doubles the Speed of the user\'s side for 4 turns.' },
  'Weather Ball':     { power: 50,  category: 'Special',  effect: 'Doubles in power and changes type based on the current weather.' },
  'Wide Guard':       { power: null, category: 'Status',  effect: 'Protects the user\'s side from spread moves for one turn.' },
  'Thunder':          { power: 110, category: 'Special',  effect: 'Hits without accuracy check in rain. May paralyze the target.' },
  'Wave Crash':       { power: 120, category: 'Physical', effect: 'User takes recoil damage equal to 1/3 of damage dealt.' },
  'Aqua Jet':         { power: 40,  category: 'Physical', effect: 'Priority move. Always strikes before non-priority moves.' },
  'Flip Turn':        { power: 60,  category: 'Physical', effect: 'User hits the target then immediately switches out.' },
  'Last Respects':    { power: 50,  category: 'Physical', effect: 'Base power increases by 50 for each fainted ally in the party.' },
  'Parting Shot':     { power: null, category: 'Status',  effect: 'Lowers the target\'s Atk and Sp. Atk by 1, then the user switches out.' },
  'Darkest Lariat':   { power: 85,  category: 'Physical', effect: 'Ignores the target\'s stat changes.' },
  'Fake Out':         { power: 40,  category: 'Physical', effect: 'Priority move that flinches the target. Only works on the first turn after switching in.' },
  'Flare Blitz':      { power: 120, category: 'Physical', effect: 'User takes recoil damage. May burn the target.' },
  'Dire Claw':        { power: 60,  category: 'Physical', effect: 'May poison, paralyze, or leave the target drowsy.' },
  'Close Combat':     { power: 120, category: 'Physical', effect: 'Lowers user\'s Def and Sp. Def by 1 stage after use.' },
  'Rock Slide':       { power: 75,  category: 'Physical', effect: 'Hits both opponents. May flinch.' },
  'Dual Wingbeat':    { power: 40,  category: 'Physical', effect: 'Hits the target twice in one turn.' },
  'Earthquake':       { power: 100, category: 'Physical', effect: 'Hits all adjacent Pokémon. Deals double damage to targets using Dig.' },
  'Stomping Tantrum': { power: 75,  category: 'Physical', effect: 'Power doubles if the user\'s last move failed.' },
  'Scale Shot':       { power: 25,  category: 'Physical', effect: 'Hits 2–5 times. Lowers user\'s Def and raises Speed after use.' },
  'Kowtow Cleave':    { power: 85,  category: 'Physical', effect: 'Never misses.' },
  'Sucker Punch':     { power: 70,  category: 'Physical', effect: 'Priority move. Fails if the target is not using an attacking move.' },
  'Low Kick':         { power: null, category: 'Physical', effect: 'Power increases based on the target\'s weight.' },
  'Moonblast':        { power: 95,  category: 'Special',  effect: 'May lower the target\'s Sp. Atk.' },
  'Dazzling Gleam':   { power: 80,  category: 'Special',  effect: 'Hits all adjacent opponents.' },
  'Calm Mind':        { power: null, category: 'Status',  effect: 'Raises the user\'s Sp. Atk and Sp. Def by 1 stage.' },
  'Heat Wave':        { power: 95,  category: 'Special',  effect: 'Hits both opponents. May burn.' },
  'Solar Beam':       { power: 120, category: 'Special',  effect: 'Charges in one turn, fires the next. Fires in one turn under harsh sunlight.' },
}

const ITEM_EFFECTS = {
  'Leftovers':      'Restores 1/16 of max HP at the end of each turn.',
  'Focus Sash':     'Holder survives any hit with 1 HP if at full HP.',
  'Choice Scarf':   'Boosts Speed by 1.5×. Locks holder into one move.',
  'Sitrus Berry':   'Restores 25% of max HP when HP falls below 50%.',
  'White Herb':     'Restores any lowered stats once, then consumed.',
  'Dragoninite':    "Dragonite's Mega Stone.",
  'Charizardite Y': 'Mega Evolves Charizard into Mega Charizard Y. Grants Drought.',
  'Dragon Fang':    'Boosts the power of Dragon-type moves by 20%.',
  'Chople Berry':   'Weakens a super effective Fighting-type hit.',
  'Floettite':      "Floette-Eternal's Mega Stone.",
}

function TypeIcon({ type }) {
  const src = TYPE_ICON[type]
  if (!src) return null
  return <img src={src} alt={type} className="poke-type-icon" />
}

function EvRow({ label, value, modifier }) {
  return (
    <div className="poke-ev-row">
      <span className={`poke-ev-label${modifier ? ` poke-ev-label--${modifier}` : ''}`}>
        {label}{modifier === 'plus' ? '+' : modifier === 'minus' ? '-' : ''}
      </span>
      <div className="poke-ev-track">
        <div className="poke-ev-fill" style={{ width: `${(value / 32) * 100}%` }} />
      </div>
      <span className="poke-ev-num">{value}</span>
    </div>
  )
}

function PokeCard({ name, sprite, type, type2, item, itemName, ability, nature, moves, evs }) {
  return (
    <div className="poke-card">
      <div className="poke-sprite-wrap">
        <img src={sprite} alt={name} className="poke-sprite" />
      </div>
      <div className="poke-name-row">
        <div>
          <p className="poke-name">{name}</p>
          <div className="poke-types">
            <TypeIcon type={type} />
            {type2 && <TypeIcon type={type2} />}
          </div>
        </div>
        <div className="poke-item-wrap">
          <img src={item} alt={itemName} className="poke-item-sprite" />
          <div className="poke-item-tooltip">
            <span className="poke-item-tooltip-name">{itemName}</span>
            {ITEM_EFFECTS[itemName] && (
              <span className="poke-item-tooltip-effect">{ITEM_EFFECTS[itemName]}</span>
            )}
          </div>
        </div>
      </div>
      <p className="poke-nature-ability">
        <span className="poke-ability">{ability}</span>
        <span className="poke-nature-sep">·</span>
        <span className="poke-nature">{nature}</span>
        <span className="poke-nature-sep">·</span>
        <span className="poke-item-name">{itemName}</span>
      </p>
      <ul className="poke-moves">
        {moves.map(move => (
          <li key={move.name} className="poke-move">
            <TypeIcon type={move.type} />
            <span>{move.name}</span>
            {(() => {
              const info = MOVE_EFFECTS[move.name]
              if (!info) return null
              return (
                <div className="poke-move-tooltip">
                  <div className="poke-move-tooltip-header">
                    <div className="poke-move-tooltip-title">
                      <TypeIcon type={move.type} />
                      <span className="poke-move-tooltip-name">{move.name}</span>
                    </div>
                    <div className="poke-move-tooltip-stats">
                      {info.power && <span className="poke-move-tooltip-power">{info.power}</span>}
                      {CATEGORY_ICON[info.category] && (
                        <img src={CATEGORY_ICON[info.category]} alt={info.category} className="poke-move-category-icon" />
                      )}
                    </div>
                  </div>
                  <span className="poke-move-tooltip-effect">{info.effect}</span>
                </div>
              )
            })()}
          </li>
        ))}
      </ul>
      <div className="poke-evs">
        {STATS.map((stat, i) => {
          const mods = NATURE_MODIFIERS[nature] ?? { plus: null, minus: null }
          const modifier = i === mods.plus ? 'plus' : i === mods.minus ? 'minus' : null
          return <EvRow key={stat} label={stat} value={evs?.[i] ?? 0} modifier={modifier} />
        })}
      </div>
    </div>
  )
}

export default function PokemonEntry({ trainer, game, team }) {
  return (
    <div className="champion-entry">
      <div className="champion-header">
        <span className="champion-trainer">{trainer}</span>
        {game && <span className="champion-game">{game}</span>}
      </div>
      <div className="champion-team">
        {team.map((poke, i) => <PokeCard key={i} {...poke} />)}
      </div>
    </div>
  )
}
