import { useState } from 'react'
import vallaQ from './assets/valla-q.jpg'
import vallaW from './assets/valla-w.jpg'
import vallaE from './assets/valla-e.jpg'
import vallaD from './assets/valla-d.jpg'
import vallaStrafe from './assets/valla-strafe.jpg'
import vallaRain from './assets/valla-rain.jpg'
import blazeQ from './assets/blaze-q.jpg'
import blazeE from './assets/blaze-e.jpg'
import blazeD from './assets/blaze-d.jpg'
import blazeBunker from './assets/blaze-bunker.jpg'
import blazeStim from './assets/blaze-stim.jpg'
import anduinQ from './assets/anduin-q.jpg'
import anduinW from './assets/anduin-w.jpg'
import anduinE from './assets/anduin-e.jpg'
import anduinD from './assets/anduin-d.jpg'
import anduinLightbomb from './assets/anduin-lightbomb.jpg'
import anduinLightwell from './assets/anduin-lightwell.jpg'
import jainaQ from './assets/jaina-q.jpg'
import jainaW from './assets/jaina-w.jpg'
import jainaE from './assets/jaina-e.jpg'
import jainaD from './assets/jaina-d.jpg'
import jainaRing from './assets/jaina-ring.jpg'
import jainaElemental from './assets/jaina-elemental.jpg'
import jainaVeins from './assets/jaina-veins.jpg'
import './HeroesOfTheStorm.css'

const HEROES = [
  {
    id: 'valla', name: 'Valla', title: 'Demon Hunter', role: 'Ranged Assassin', universe: 'Diablo', accent: '#dc607d', portrait: vallaD,
    source: 'https://www.icy-veins.com/heroes/valla-build-guide', reviewed: 'May 2, 2025 · patch 2.55.10',
    overview: 'A fragile, high-output damage dealer who rewards disciplined positioning and constant Hatred upkeep.',
    abilities: [['Q','Hungering Arrow',vallaQ],['W','Multishot',vallaW],['E','Vault',vallaE],['D','Hatred',vallaD]],
    builds: [
      { title:'Multishot', subtitle:'Wide-angle pressure', icon:vallaW, summary:'Reliable area damage, fast Hatred generation, and simple teamfight value.', bestFor:'Clumped teams · waveclear · steady poke', gameplan:'Tag multiple Heroes with Multishot to stack Fire At Will, then use Arsenal’s extra range to pressure safely. Wait for enemy crowd control before committing to Strafe.', reminder:'Use Gloom before Multishot—Fire At Will quickly rebuilds the Hatred you spend.', talents:[[1,'Fire At Will','W','Stack Multishot damage and Hatred.',vallaW],[4,'Arsenal','W','Range, grenades, and Mana refund.',vallaW],[7,'Hot Pursuit','D','Extra speed for spacing and kiting.',vallaD],[10,'Strafe','R','Large-area teamfight damage.',vallaStrafe],[13,'Gloom','D','Spell Armor when burst threatens.',vallaD],[16,'Punishment','W','More Multishots at full Hatred.',vallaW],[20,'Death Siphon','R','Strafe healing and duration.',vallaStrafe]] },
      { title:'Hungering Arrow', subtitle:'Isolated-target burst', icon:vallaQ, summary:'Front-loaded single-target damage that punishes isolated enemies and burns objectives.', bestFor:'Burst comps · isolated targets · Battlefield of Eternity', gameplan:'Clear nearby summons and minions before firing so every bounce finds the intended target. Vault resets Hungering Arrow—save the sequence for a clean burst window.', reminder:'Do not fire through a minion wave—the bounces can home into the wrong targets.', talents:[[1,'Puncturing Arrow','Q','Add a bounce and stack impact damage.',vallaQ],[4,'Repeating Arrow','E','Vault resets Hungering Arrow.',vallaE],[7,'Frost Shot','W','Slow first; arrows hit harder.',vallaW],[10,'Rain of Vengeance','R','Stun setup, peel, and follow-up.',vallaRain],[13,'Siphoning Arrows','Q','Hero hits restore Health.',vallaQ],[16,'Seething Hatred','D','Boost damage at full Hatred.',vallaD],[20,'Acrobat','E','Extra Vaults enable arrow chains.',vallaE]] },
    ],
  },
  {
    id:'blaze', name:'Blaze', title:'Veteran Firebat', role:'Tank / Offlaner', universe:'StarCraft', accent:'#ef8d3f', portrait:blazeD,
    source:'https://www.icy-veins.com/heroes/blaze-build-guide', reviewed:'July 20, 2026 · latest patch',
    overview:'A durable area-control tank with excellent waveclear, long-range engage, and a fight-saving Bunker.',
    abilities:[['Q','Flame Stream',blazeQ],['W','Oil Spill',blazeD],['E','Jet Propulsion',blazeE],['D','Pyromania',blazeD]],
    builds:[
      { title:'Basic Attacks', subtitle:'Offlane control', icon:blazeStim, summary:'Fast lane and camp clear with strong sustained pressure and late-game durability.', bestFor:'Offlane · mercenary camps · macro pressure', gameplan:'Keep your Health above 80% for Stimpack’s passive, clear waves with empowered Basic Attacks, and rotate early. Use Jet Propulsion from fog or after Oil slows the target.', reminder:'Bunker is a cleanse and damage reset for the whole team—not just an escape for Blaze.', talents:[[1,'Adrenaline Stimpack','1','Attack and movement speed.',blazeStim],[4,'Incinerator Gauntlets','AA','Empower wave and camp clear.',blazeQ],[7,'Suppressive Fire','Q','Reduce enemy Spell Power.',blazeQ],[10,'Bunker Drop','R','Team cleanse and protection.',blazeBunker],[13,'Collision Course','E','Jet impact burst.',blazeE],[16,'Juggernaut Plating','1','Anti-burst active defense.',blazeD],[20,'Fortified Bunker','R','More Armor and firepower.',blazeBunker]] },
      { title:'Oil Spill', subtitle:'Main-tank engage', icon:blazeD, summary:'Controls space with stronger Oil slows and creates reliable Jet Propulsion openings.', bestFor:'Main tank · two or fewer melee enemies · objective fights', gameplan:'Place Oil beyond the target so retreat crosses the full slow, then charge once movement is constrained. Ignite only when healing matters; unlit Oil controls space longer.', reminder:'Jet Propulsion is easier to land after Oil Spill—avoid opening with a visible max-range charge.', talents:[[1,'New Habits','D','Faster Pyromania and Unstoppable.',blazeD],[4,'Oil Dispersal','W','Larger, stronger Oil control.',blazeD],[7,'Nanomachine Coating','W','Reduce enemy Attack Speed.',blazeD],[10,'Bunker Drop','R','Save allies and deny burst.',blazeBunker],[13,'Collision Course','E','Reward clean engages.',blazeE],[16,'Thermal Protection','E','Armor and charge cooldown.',blazeE],[20,'Fortified Bunker','R','Upgrade the team reset.',blazeBunker]] },
    ],
  },
  {
    id:'anduin', name:'Anduin', title:'King of Stormwind', role:'Healer', universe:'Warcraft', accent:'#e3c467', portrait:anduinD,
    source:'https://www.icy-veins.com/heroes/anduin-build-guide', reviewed:'July 12, 2026 · latest review',
    overview:'A backline healer with reliable burst healing, baseline rescue utility, and strong counter-engage tools.',
    abilities:[['Q','Flash Heal',anduinQ],['W','Divine Star',anduinW],['E','Chastise',anduinE],['D','Leap of Faith',anduinD]],
    builds:[
      { title:'Lightwell', subtitle:'Sustain healing', icon:anduinLightwell, summary:'Efficient long-fight healing for teams that can hold a position around an objective.', bestFor:'Sustain damage · stationary fights · objective control', gameplan:'Place Lightwell where allies can fight without abandoning it. Spread Renew with Flash Heal, then use Moral Compass attacks to refresh those effects while staying at safe range.', reminder:'Lightbomb is the default Heroic; save Salvation for drafts that cannot interrupt the channel.', talents:[[1,'Lightwell','1','Free healing in a fixed area.',anduinLightwell],[4,'Moral Compass','W','Safer range and extra attacks.',anduinW],[7,'Binding Heal','Q','Heal yourself while healing allies.',anduinQ],[10,'Lightbomb','R','Shield and area stun.',anduinLightbomb],[13,'Speed of the Pious','W','Speed and Divine Star cooldown.',anduinW],[16,'Renew','Q','Refreshable healing over time.',anduinQ],[20,"Varian's Legacy",'AA','Damage and self-sustain.',anduinD]] },
      { title:'Leap of Faith', subtitle:'Burst rescue', icon:anduinD, summary:'Sacrifices some sustain to answer crowd control, dive, and lethal burst windows.', bestFor:'Burst damage · heavy crowd control · saving divers', gameplan:'Hold Leap of Faith until enemy crowd control commits; pulling too early wastes its Unstoppable. Use Binding Heal to recover while stabilizing an ally, then keep enough distance to make both late-game pulls useful.', reminder:'At level 16, two Leap charges change fights—position far enough back to make both pulls useful.', talents:[[1,'Power Word: Shield','W','Shield allies and Anduin.',anduinW],[4,'Moral Compass','W','Contribute safely from range.',anduinW],[7,'Binding Heal','Q','Heal yourself while healing allies.',anduinQ],[10,'Lightbomb','R','Counter-engage and protection.',anduinLightbomb],[13,"Lion's Speed",'D','Speed and post-pull healing.',anduinD],[16,'Glyph of Faith','D','Gain a second rescue charge.',anduinD],[20,"Varian's Legacy",'AA','Damage and self-sustain.',anduinD]] },
    ],
  },
  {
    id:'jaina', name:'Jaina', title:'Archmage', role:'Ranged Assassin', universe:'Warcraft', accent:'#72c9ee', portrait:jainaD,
    source:'https://www.icy-veins.com/heroes/jaina-build-guide', reviewed:'March 16, 2026 · balance patch',
    overview:'A combo-focused Frost Mage with exceptional burst, area control, and waveclear—but very little margin for poor positioning.',
    abilities:[['Q','Frostbolt',jainaQ],['W','Blizzard',jainaW],['E','Cone of Cold',jainaE],['D','Frostbite',jainaD]],
    builds:[
      { title:'Frostbolt', subtitle:'Single-target pressure', icon:jainaQ, summary:'Reliable sustained poke that becomes lethal once Frostbolt repeatedly connects with Chilled targets.', bestFor:'Standard games · frontline pressure · safe poke', gameplan:'Apply Chill before each Frostbolt so Ice Lance refunds cooldown and Mana. Summon Water Elemental early in the fight to keep targets Chilled, then use Icy Veins when you have room to keep casting.', reminder:'Frostbolt can pierce with Frost Shards—line up a second Hero instead of treating the frontline as a blocker.', talents:[[1,'Fingers of Frost','D','Mana regeneration and bonus damage.',jainaD],[4,'Frost Shards','Q','Frostbolt pierces two targets.',jainaQ],[7,'Ice Lance','Q','Faster Frostbolts on Chilled targets.',jainaQ],[10,'Water Elemental','R','Reliable Chill and sustained pressure.',jainaElemental],[13,'Icy Veins','1','Rapid, cheaper Basic Abilities.',jainaVeins],[16,'Northern Exposure','E','Reduce Armor for the burst window.',jainaE],[20,'Wintermute','R','Elemental mirrors Basic Abilities.',jainaElemental]] },
      { title:'Cone of Cold', subtitle:'Anti-melee control', icon:jainaE, summary:'Turns repeated Cone of Cold casts into a punishing root-and-burst cycle against grouped melee Heroes.', bestFor:'Multiple melee enemies · dive defense · wombo combos', gameplan:'Chill enemies before Cone of Cold so Numbing Blast roots them. Activate Icy Veins only after enemies commit, then chain wide Cones and Blizzards while the root keeps every wave on target.', reminder:'Ring of Frost needs setup—cast it after allied control or your own Numbing Blast, not as an opener.', talents:[[1,'Fingers of Frost','D','Mana and stronger Frostbite.',jainaD],[4,'Arcane Intellect','D','Mana returns and high-Mana power.',jainaD],[7,'Ice Floes','E','Wider Cone with cooldown refunds.',jainaE],[10,'Ring of Frost','R','Long area root for committed fights.',jainaRing],[13,'Icy Veins','1','Fuel the control-and-burst cycle.',jainaVeins],[16,'Numbing Blast','E','Root targets already Chilled.',jainaE],[20,'Cold Snap','R','Upgrade Ring and reset Frostbolt.',jainaRing]] },
    ],
  },
]

function HeroNav({ activeHero, onSelect }) {
  return <nav className="hots-hero-nav" aria-label="Choose a hero">{HEROES.map(hero => <button key={hero.id} className={activeHero === hero.id ? 'is-active' : ''} style={{'--hero-accent':hero.accent}} onClick={() => onSelect(hero.id)}><img src={hero.portrait} alt="" /><span><strong>{hero.name}</strong><small>{hero.role}</small></span></button>)}</nav>
}

function BuildCard({ build, accent }) {
  return <article className="hots-build" style={{'--build-accent':accent}}><header className="hots-build-header"><img src={build.icon} alt="" /><div><p>{build.subtitle}</p><h3>{build.title}</h3></div></header><p className="hots-build-summary">{build.summary}</p><p className="hots-best-for"><span>Best for</span>{build.bestFor}</p><ol className="hots-talents" aria-label={`${build.title} talent order`}>{build.talents.map(([level,name,key,note,image]) => <li className="hots-talent" key={level}><span className="hots-level">{level}</span><img src={image} alt="" /><span className="hots-talent-copy"><strong>{name}<kbd>{key}</kbd></strong><small>{note}</small></span></li>)}</ol><div className="hots-plan"><span>How to play it</span><p>{build.gameplan}</p></div><p className="hots-reminder"><strong>Remember</strong>{build.reminder}</p></article>
}

export default function HeroesOfTheStorm() {
  const [activeId,setActiveId] = useState('valla')
  const hero = HEROES.find(item => item.id === activeId) ?? HEROES[0]
  return <div className="hots-shell" style={{'--hero-accent':hero.accent}}><HeroNav activeHero={hero.id} onSelect={setActiveId} /><section className="hots-guide"><header className="hots-hero-header"><img className="hots-portrait" src={hero.portrait} alt={`${hero.name} ability artwork`} /><div><p className="hots-kicker">{hero.universe} · {hero.role}</p><h2>{hero.name}</h2><p className="hots-hero-title">{hero.title}</p><p className="hots-overview">{hero.overview}</p></div><div className="hots-abilities" aria-label={`${hero.name} basic abilities`}>{hero.abilities.map(([key,name,image]) => <span key={key}><img src={image} alt="" /><kbd>{key}</kbd><small>{name}</small></span>)}</div><a href={hero.source} target="_blank" rel="noreferrer" className="hots-source">Icy Veins source ↗</a></header><div className="hots-build-grid">{hero.builds.map(build => <BuildCard key={build.title} build={build} accent={hero.accent} />)}</div><footer className="hots-guide-footer"><span>Source reviewed {hero.reviewed}</span><span>Game artwork © Blizzard Entertainment · personal reference guide</span></footer></section></div>
}
