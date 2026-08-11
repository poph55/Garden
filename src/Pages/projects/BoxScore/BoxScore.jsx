import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGame, getSchedule } from './mlbApi'
import stadiumData from './stadiumProfiles.json'
import './BoxScore.css'

const logoModules = import.meta.glob('../../garden/Baseball/team icons/*.png', { eager: true, import: 'default' })
const teamLogos = Object.fromEntries(Object.entries(logoModules).map(([path, source]) => [path.match(/([^/]+)\.png$/)?.[1], source]))
const stadiumProfileKeys = {
  LAA:'angels',HOU:'astros',ATH:'athletics',OAK:'athletics',TOR:'blue_jays',ATL:'braves',MIL:'brewers',STL:'cardinals',CHC:'cubs',ARI:'diamondbacks',LAD:'dodgers',SF:'giants',CLE:'guardians',SEA:'mariners',MIA:'marlins',NYM:'mets',WSH:'nationals',BAL:'orioles',SD:'padres',PHI:'phillies',PIT:'pirates',TEX:'rangers',TB:'rays',BOS:'red_sox',CIN:'reds',COL:'rockies',KC:'royals',DET:'tigers',MIN:'twins',CWS:'white_sox',NYY:'yankees'
}
const teamHighlights = {
  ARI:'#e8c8ce', ATL:'#edc0c8', BAL:'#f3c393', BOS:'#e8bfc2', CHC:'#c6d4ed',
  CWS:'#d8d6cf', CIN:'#f1c9c7', CLE:'#c4d8df', COL:'#ddd0ea', DET:'#cbd5df',
  HOU:'#edc8a6', KC:'#c9d9f1', LAA:'#eec2cc', LAD:'#c6def2', MIA:'#bde5e9',
  MIL:'#dcd0a6', MIN:'#cedbe8', NYM:'#d1d8ef', NYY:'#d6dce6', ATH:'#c6dfcf',
  PHI:'#f0c3c7', PIT:'#efd37f', SD:'#e4d0a4', SEA:'#bdd9d6', SF:'#f4c9a5',
  STL:'#eac6c2', TB:'#c9dae7', TEX:'#cbd5e9', TOR:'#c3d8ec', WSH:'#e9c1c4'
}
const teamAccents = {
  ARI:'#a71930', ATL:'#ce1141', BAL:'#df4601', BOS:'#bd3039', CHC:'#0e3386',
  CWS:'#27251f', CIN:'#c6011f', CLE:'#e31937', COL:'#33006f', DET:'#0c2340',
  HOU:'#eb6e1f', KC:'#004687', LAA:'#ba0021', LAD:'#005a9c', MIA:'#00a3e0',
  MIL:'#ffc52f', MIN:'#d31145', NYM:'#ff5910', NYY:'#132448', ATH:'#003831',
  PHI:'#e81828', PIT:'#fdb827', SD:'#2f241d', SEA:'#005c5c', SF:'#fd5a1e',
  STL:'#c41e3a', TB:'#8fbce6', TEX:'#003278', TOR:'#134a8e', WSH:'#ab0003'
}
const darkAccentText = new Set(['BAL','HOU','MIA','MIL','NYM','PIT','SF','TB'])
const logoKey = abbreviation => abbreviation === 'ARI' ? 'AZ' : abbreviation
const circleColor = team => teamHighlights[team.abbr] || '#d8ddd7'
const accentColor = team => teamAccents[team.abbr] || team.color
const accentText = team => darkAccentText.has(team.abbr) ? '#18201c' : '#ffffff'

const today = new Date().toLocaleDateString('en-CA')
const shiftDate = (date, days) => { const next = new Date(`${date}T12:00:00`); next.setDate(next.getDate() + days); return next.toLocaleDateString('en-CA') }
const readableDate = date => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()

function TeamMark({ team }) { const logo = teamLogos[logoKey(team.abbr)]; return <span className="team-mark" style={{ '--team': circleColor(team) }}>{logo ? <img src={logo} alt="" /> : team.abbr}</span> }

export default function BoxScore() {
  const [date, setDate] = useState(today), [games, setGames] = useState([]), [selected, setSelected] = useState(null), [game, setGame] = useState(null)
  const [query, setQuery] = useState(''), [tab, setTab] = useState('game'), [scheduleState, setScheduleState] = useState('loading'), [gameState, setGameState] = useState('idle'), [error, setError] = useState('')
  const [statsTeam, setStatsTeam] = useState('away')

  useEffect(() => {
    const controller = new AbortController()
    getSchedule(date, controller.signal).then(next => { setGames(next); setGameState(next.length ? 'loading' : 'idle'); setSelected(next[0]?.id || null); setScheduleState('ready') }).catch(err => { if (err.name !== 'AbortError') { setError('MLB data is temporarily unavailable. Try again in a moment.'); setScheduleState('error') } })
    return () => controller.abort()
  }, [date])

  useEffect(() => {
    if (!selected) return
    const controller = new AbortController()
    getGame(selected, controller.signal).then(next => { setGame(next); setGameState('ready') }).catch(err => { if (err.name !== 'AbortError') { setError('That box score could not be loaded. Please choose another game.'); setGameState('error') } })
    return () => controller.abort()
  }, [selected])

  const filtered = useMemo(() => games.filter(g => `${g.away.city} ${g.away.name} ${g.away.abbr} ${g.home.city} ${g.home.name} ${g.home.abbr}`.toLowerCase().includes(query.toLowerCase())), [games, query])
  const innings = Array.from({ length: Math.max(9, game?.away.innings.length || 0) }, (_, i) => i + 1)

  return <main className="boxscore-page">
    <header className="score-nav"><Link to="/projects" className="score-brand">BOX<span>SCORE</span></Link><p>Baseball, play by play.</p><Link to="/projects" className="score-exit">All projects ↗</Link></header>
    <section className="score-shell">
      <aside className="game-browser">
        <div className="browser-heading"><p className="eyebrow">MLB scoreboard</p><h1>Find a game.</h1></div>
        <label className="game-search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Team" aria-label="Filter games by team" /></label>
        <div className="date-row"><button onClick={() => setDate(shiftDate(date,-1))} aria-label="Previous day">←</button><label><span className="visually-hidden">Choose date</span><input type="date" value={date} onChange={e => setDate(e.target.value)} /></label><strong>{readableDate(date)}</strong><button onClick={() => setDate(shiftDate(date,1))} aria-label="Next day">→</button></div>
        <div className="game-list" aria-busy={scheduleState === 'loading'}>
          {scheduleState === 'loading' && <p className="browser-message">Loading MLB games…</p>}
          {scheduleState === 'ready' && filtered.map(g => <button key={g.id} className={`game-card ${g.id === selected ? 'active' : ''}`} onClick={() => { setSelected(g.id); setTab('game'); setError('') }}><span className="card-date">{g.date} · {g.status}</span><span className="card-team"><TeamMark team={g.away}/><b>{g.away.abbr}</b><strong>{g.away.score}</strong></span><span className="card-team"><TeamMark team={g.home}/><b>{g.home.abbr}</b><strong>{g.home.score}</strong></span></button>)}
          {scheduleState === 'ready' && !filtered.length && <p className="browser-message">No matching MLB games on this date.</p>}
          {scheduleState === 'error' && <button className="retry-button" onClick={() => setDate(shiftDate(date,-1))}>Try the previous day</button>}
        </div>
        <p className="data-credit">Data provided by MLB Stats API</p>
      </aside>
      <article className="game-detail" aria-live="polite" aria-busy={gameState === 'loading'}>
        {error && <div className="score-alert" role="alert">{error}</div>}
        {gameState === 'loading' && <GameSkeleton />}
        {scheduleState === 'ready' && !selected && <div className="empty-detail"><p className="eyebrow">No games</p><h2>Choose another date.</h2><button onClick={() => setDate(shiftDate(date,-1))}>View previous day</button></div>}
        {game && gameState === 'ready' && <><div className="game-meta"><span>{game.status}</span><p>{game.date} · {game.venue} · {game.duration}</p><WeatherBadge weather={game.weather}/></div><section className="matchup" aria-label={`${game.away.name} at ${game.home.name}`}>{[game.away,game.home].map(team => <div className="match-team" key={team.id}><TeamMark team={team}/><div><small>{team.city}</small><h2>{team.name}</h2></div><strong>{team.score}</strong></div>)}</section><nav className="detail-tabs" aria-label="Box score views">{[['game','Game'],['batting','Batting'],['pitching','Pitching']].map(([id,label]) => <button key={id} onClick={() => setTab(id)} className={tab === id ? 'active' : ''}>{label}</button>)}</nav>{tab === 'game' && <GameView game={game} innings={innings}/>} {tab === 'batting' && <TeamStats game={game} selected={statsTeam} onSelect={setStatsTeam} title="Batting" heads={['PLAYER','POS','AB','R','H','RBI','BB']} rows={game.batters}/>} {tab === 'pitching' && <TeamStats game={game} selected={statsTeam} onSelect={setStatsTeam} title="Pitching" heads={['PITCHER','TEAM','IP','H','ER','BB','K']} rows={game.pitchers}/>}</>}
      </article>
    </section>
  </main>
}

function WeatherBadge({weather}) {
  if (!weather) return null
  const condition=weather.condition.toLowerCase(),icon=condition.includes('rain')?'☂':condition.includes('cloud')||condition.includes('overcast')?'☁':condition.includes('snow')?'❄':condition.includes('roof')?'⌂':'☀'
  const summary=`${weather.condition}${weather.temperature!=null?`, ${weather.temperature} degrees Fahrenheit`:''}. ${weather.wind}`
  return <button className="weather-badge" aria-label={`Game weather: ${summary}`}><span aria-hidden="true">{icon}</span><div className="weather-popover" role="tooltip"><small>Game weather</small><strong>{weather.condition}</strong><dl><div><dt>Temperature</dt><dd>{weather.temperature!=null?`${weather.temperature}°F`:'—'}</dd></div><div><dt>Wind</dt><dd>{weather.wind}</dd></div></dl></div></button>
}

function GameView({ game, innings }) {
  const awayColor = accentColor(game.away), homeColor = accentColor(game.home)
  return <>
    <section className="line-score">
      <div className="line-row line-head" style={{'--innings':innings.length}}><span>TEAM</span>{innings.map(i=><span key={i}>{i}</span>)}<b>R</b><b>H</b><b>E</b></div>
      {[game.away,game.home].map(team=><div className="line-row" style={{'--innings':innings.length,'--run-color':accentColor(team),'--run-text':accentText(team)}} key={team.abbr}><strong>{team.abbr}</strong>{innings.map((_,i)=><span key={i} className={Number(team.innings[i])>0?'hot':''}>{team.innings[i]??'—'}</span>)}<b>{team.score}</b><b>{team.hits}</b><b>{team.errors}</b></div>)}
    </section>
    <section className="game-story" style={{'--away-color':awayColor,'--home-color':homeColor}}>
      <header className="run-chart-header"><p className="eyebrow">Score progression</p><div className="run-legend"><span><i style={{background:awayColor}}/>{game.away.abbr}</span><span><i style={{background:homeColor}}/>{game.home.abbr}</span></div></header>
      <CumulativeRuns game={game} innings={innings} awayColor={awayColor} homeColor={homeColor}/>
      <WinProbability game={game} awayColor={awayColor} homeColor={homeColor}/>
    </section>
    <PlayerContribution game={game}/>
    <section className="key-plays"><p className="eyebrow">Scoring plays</p>{game.plays.length?game.plays.map((p,i)=>{const team=p.side==='TOP'?game.away:game.home;return <div className="play" style={{'--play-color':accentColor(team),'--play-text':accentText(team)}} key={`${p.inn}-${i}`}><time>{p.side} {p.inn}</time><span className="run-dot">+{p.runs}</span><div><strong>{p.label}</strong><p>{p.detail}</p></div></div>}):<p className="no-plays">No scoring plays yet.</p>}</section>
  </>
}
function CumulativeRuns({game,innings,awayColor,homeColor}){
  let awayTotal=0,homeTotal=0
  const awayPoints=[0],homePoints=[0]
  innings.forEach((_,index)=>{awayTotal+=Number(game.away.innings[index])||0;awayPoints.push(awayTotal);homePoints.push(homeTotal);homeTotal+=Number(game.home.innings[index])||0;awayPoints.push(awayTotal);homePoints.push(homeTotal)})
  const maxScore=Math.max(1,...awayPoints,...homePoints),steps=awayPoints.length-1
  const renderTeam=(points,color,label)=>points.map((score,index)=>{
    const x=index/steps*100,y=92-score/maxScore*82,next=points[index+1],nextY=next==null?y:92-next/maxScore*82,width=100/steps
    return <span key={`${label}-${index}`}>{next!=null&&<><i className="score-step-horizontal" style={{left:`${x}%`,top:`${y}%`,width:`${width}%`,'--score-color':color}}/>{nextY!==y&&<i className="score-step-vertical" style={{left:`${x+width}%`,top:`${Math.min(y,nextY)}%`,height:`${Math.abs(nextY-y)}%`,'--score-color':color}}/>}</>}<button className="score-point" style={{left:`${x}%`,top:`${y}%`,'--score-color':color}} aria-label={`${label}, ${index===0?'start':`${index%2?'top':'bottom'} ${Math.ceil(index/2)}`}, ${score} runs`}><b>{score}</b></button></span>
  })
  return <div className="score-progress" aria-label={`Cumulative score progression for ${game.away.name} and ${game.home.name}`}><div className="score-grid"><small className="score-y score-y-top">{maxScore}</small><small className="score-y score-y-mid">{Math.round(maxScore/2)}</small><small className="score-y score-y-bottom">0</small>{renderTeam(awayPoints,awayColor,game.away.abbr)}{renderTeam(homePoints,homeColor,game.home.abbr)}</div><div className="score-innings">{innings.map(inning=><small key={inning}>{inning}</small>)}</div></div>
}
function PlayerContribution({game}){
  const [hovered,setHovered]=useState(null),players=game.contributions||[],leader=players[0],max=leader?.score||1
  return <section className="contribution-section"><header><div><p className="eyebrow">Game impact</p><h3>Who shaped the game?</h3></div><small>Prototype score · batting + pitching</small></header>{players.length?<div className="contribution-layout"><div className="impact-leader" style={{'--impact-color':accentColor(game[leader.side])}}><span>Game standout</span><TeamMark team={game[leader.side]}/><div><strong>{leader.name}</strong><p>{leader.team} · {leader.position}</p></div><b>{leader.score}</b></div><div className={`impact-chart ${hovered?'has-hover':''}`}>{players.map((player,index)=>{const active=hovered?.id===player.id;return <button key={player.id} className={`impact-row ${active?'active':''} ${hovered&&!active?'dimmed':''}`} onMouseEnter={()=>setHovered(player)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(player)} onBlur={()=>setHovered(null)} aria-label={`${index+1}. ${player.name}, ${player.score} impact points. ${player.detail}`}><span className="impact-rank">{index+1}</span><span className="impact-name"><strong>{player.name}</strong><small>{player.team} · {player.detail}</small></span><i><em style={{width:`${Math.max(7,player.score/max*100)}%`,background:accentColor(game[player.side])}}/></i><b>{player.score}</b></button>})}</div></div>:<p className="no-plays">Player impact will appear after statistics are recorded.</p>}<p className="impact-note">Impact score is an illustrative, unofficial estimate based on runs, RBI, hits, extra-base hits, walks, steals, innings, strikeouts, earned runs and pitcher decisions.</p></section>
}
function WinProbability({game,awayColor,homeColor}){const points=game.winProbability||[];const latest=points.at(-1)?.home??50;return <section className="win-prob"><header><div><p className="eyebrow">Estimated win probability</p><small>After each completed plate appearance</small></div><strong>{game.home.abbr} {latest}%</strong></header><div className="prob-chart" aria-label={`Estimated win probability timeline. ${game.home.name} currently ${latest} percent.`}><span className="prob-midline"/><span className="prob-axis prob-axis-top">100</span><span className="prob-axis prob-axis-mid">50</span><span className="prob-axis prob-axis-bottom">0</span><div className="prob-columns">{points.map((point,index)=><i className="prob-column" key={index} title={`${point.half} ${point.inning} · ${point.label} · ${game.home.abbr} ${point.home}%`}><span style={{height:`${100-point.home}%`,background:awayColor}}/><span style={{height:`${point.home}%`,background:homeColor}}/></i>)}</div></div><div className="prob-footer"><span style={{color:awayColor}}>{game.away.abbr}</span><div>{Array.from({length:Math.max(9,game.away.innings.length)},(_,i)=><small key={i}>{i+1}</small>)}</div><span style={{color:homeColor}}>{game.home.abbr}</span></div></section>}
function GameSkeleton(){return <div className="game-skeleton" role="status"><span>Loading box score…</span><i/><i/><i/><i/></div>}
function TeamStats({game,selected,onSelect,title,heads,rows}){return <section className="team-stats">{title==='Batting'&&<SprayChart game={game}/>} {title==='Pitching'&&<PitchLocationChart game={game}/>}<div className="team-switcher" aria-label={`Select team for ${title.toLowerCase()} statistics`}>{['away','home'].map(side=>{const team=game[side];return <button key={side} className={selected===side?'active':''} onClick={()=>onSelect(side)} aria-pressed={selected===side}><TeamMark team={team}/><span><small>{side}</small><strong>{team.abbr}</strong></span></button>})}</div><StatsTable title={`${game[selected].city} ${game[selected].name} · ${title}`} heads={heads} rows={rows[selected]||[]}/></section>}
function SprayChart({game}){
  const [scope,setScope]=useState('both'),[outcome,setOutcome]=useState('all'),[hovered,setHovered]=useState(null)
  const scopedHits=scope==='both'?[...(game.sprayHits?.away||[]),...(game.sprayHits?.home||[])]:game.sprayHits?.[scope]||[]
  const classify=hit=>hit.outcome||({Single:'1b',Double:'2b',Triple:'3b','Home Run':'hr'})[hit.result]||'out'
  const matches=(hit,value)=>value==='all'||(value==='hit'&&classify(hit)!=='out')||classify(hit)===value
  const hits=scopedHits.filter(hit=>matches(hit,outcome))
  const outcomeOptions=[['all','All'],['hit','Hits'],['out','Outs'],['1b','1B'],['2b','2B'],['3b','3B'],['hr','HR']]
  return <section className="spray-section"><header><div><p className="eyebrow">Batted-ball spray chart</p><h3>Where contact landed.</h3></div><div className="spray-filter-stack"><div className="spray-controls" aria-label="Filter spray chart by team">{['away','both','home'].map(option=><button key={option} className={scope===option?'active':''} onClick={()=>{setScope(option);setHovered(null)}} aria-pressed={scope===option}>{option==='both'?'Both':game[option].abbr}</button>)}</div><div className="spray-outcome-controls" aria-label="Filter spray chart by result">{outcomeOptions.map(([value,label])=><button key={value} className={outcome===value?'active':''} onClick={()=>{setOutcome(value);setHovered(null)}} aria-pressed={outcome===value}>{label}</button>)}</div></div></header><div className="park-name"><span>{game.park?.name||game.venue}</span><small>{game.park?'MLB park dimensions':'Standard field profile'}</small></div><div className="spray-layout"><ParkField game={game} hits={hits} hovered={hovered} setHovered={setHovered}/><aside className="spray-detail" aria-live="polite">{hovered?<><p><span style={{background:accentColor(game[hovered.side])}}/>{hovered.team} · {hovered.half} {hovered.inning}</p><h4>{hovered.batter}</h4><strong>{hovered.result}</strong><dl><div><dt>Exit velocity</dt><dd>{hovered.exitVelocity?`${hovered.exitVelocity} mph`:'—'}</dd></div><div><dt>Launch angle</dt><dd>{hovered.launchAngle!=null?`${hovered.launchAngle}°`:'—'}</dd></div><div><dt>Distance</dt><dd>{hovered.distance?`${hovered.distance} ft`:'—'}</dd></div><div><dt>Type</dt><dd>{hovered.trajectory?.replaceAll('_',' ')||'—'}</dd></div></dl></>:<><p className="eyebrow">Explore contact</p><h4>{hits.length} results shown</h4><span>Hover a trajectory to inspect the batter and result.</span></>}</aside></div>{!hits.length&&<p className="no-plays">No batted balls match these filters.</p>}</section>
}
function ParkField({game,hits,hovered,setHovered}){
  const profileKey=stadiumProfileKeys[game.home.abbr],flatPath=stadiumData.profiles[profileKey]||stadiumData.profiles.generic
  const boundary=[]
  for(let index=0;index<flatPath.length;index+=2) boundary.push({x:flatPath[index]/2.5,y:flatPath[index+1]/2.5})
  const fenceEnd=boundary.reduce((best,point,index)=>point.x<boundary[best].x?index:best,0),fence=boundary.slice(0,fenceEnd+1)
  const polygon=`polygon(${boundary.map(point=>`${point.x}% ${point.y}%`).join(', ')})`
  const dimensions=game.park?[game.park.rightLine,game.park.rightCenter,game.park.center,game.park.leftCenter,game.park.leftLine]:[]
  const labelPoints=dimensions.length?dimensions.map((distance,index)=>fence[Math.round(index*(fence.length-1)/4)]&&({...fence[Math.round(index*(fence.length-1)/4)],distance})).filter(Boolean):[]
  return <div className={`spray-field park-field detailed-park ${hovered?'has-hover':''}`} aria-label={`${hits.length} balls in play at ${game.park?.name||game.venue}`}><span className="park-grass" style={{clipPath:polygon}}/><span className="field-diamond"/><span className="home-plate"/>{fence.slice(0,-1).map((point,index)=>{const next=fence[index+1],dx=next.x-point.x,dy=next.y-point.y;return <i key={index} className="fence-segment" style={{left:`${point.x}%`,top:`${point.y}%`,width:`${Math.hypot(dx,dy)}%`,'--fence-angle':`${Math.atan2(dy,dx)*180/Math.PI}deg`}}/>})}{labelPoints.map((point,index)=><small className={`fence-distance fence-distance-${index}`} key={`${point.distance}-${index}`} style={{left:`${point.x}%`,top:`${point.y}%`}}>{point.distance}'</small>)}{hits.map(hit=>{const targetX=Math.max(1,Math.min(99,hit.x/2.5)),targetY=Math.max(1,Math.min(96,hit.y/2.5)),dx=targetX-50,dy=targetY-82,length=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI,active=hovered?.id===hit.id;return <button key={hit.id} className={`spray-line ${active?'active':''} ${hovered&&!active?'dimmed':''}`} style={{left:'50%',top:'82%','--length':`${length}%`,'--angle':`${angle}deg`,'--hit-color':accentColor(game[hit.side])}} onMouseEnter={()=>setHovered(hit)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(hit)} onBlur={()=>setHovered(null)} aria-label={`${hit.batter}, ${hit.result}, ${hit.distance?`${hit.distance} feet`:'distance unavailable'}, ${hit.half} ${hit.inning}`}><span/></button>})}</div>
}
function PitchLocationChart({game}){
  const [side,setSide]=useState('away'),[pitcherId,setPitcherId]=useState(null),[hovered,setHovered]=useState(null)
  const staff=game.pitchLocations?.[side]||[],pitcher=staff.find(item=>item.id===pitcherId)||staff[0]
  return <section className="pitch-section" style={{'--pitch-color':accentColor(game[side])}}><header><div><p className="eyebrow">Pitch location</p><h3>Attack the zone.</h3></div><div className="pitch-team-controls" aria-label="Select pitching team">{['away','home'].map(option=><button key={option} className={side===option?'active':''} onClick={()=>setSide(option)} aria-pressed={side===option}><TeamMark team={game[option]}/><span>{game[option].abbr}</span></button>)}</div></header>{staff.length?<><div className="pitcher-picker"><label htmlFor="pitcher-select">Pitcher</label><select id="pitcher-select" value={pitcher?.id||''} onChange={event=>{setPitcherId(Number(event.target.value));setHovered(null)}}>{staff.map(item=><option key={item.id} value={item.id}>{item.name} · {item.pitches.length} pitches</option>)}</select></div><div className="pitch-layout"><div className={`pitch-plot ${hovered?'has-hover':''}`} aria-label={`${pitcher?.pitches.length||0} pitch locations for ${pitcher?.name}`}><span className="strike-zone"><i/><i/><i/><i/></span><span className="plate-shape"/>{pitcher?.pitches.map(pitch=>{const left=Math.max(4,Math.min(96,50+(pitch.x/2)*44)),top=Math.max(3,Math.min(96,95-(pitch.z/5)*88)),active=hovered?.id===pitch.id;return <button key={pitch.id} className={`pitch-dot ${active?'active':''} ${hovered&&!active?'dimmed':''}`} style={{left:`${left}%`,top:`${top}%`}} onMouseEnter={()=>setHovered(pitch)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(pitch)} onBlur={()=>setHovered(null)} aria-label={`${pitch.number}. ${pitch.type}, ${pitch.call}, ${pitch.speed||'unknown'} miles per hour`}><span>{pitch.number}</span></button>})}<small className="pitch-axis pitch-axis-high">5 ft</small><small className="pitch-axis pitch-axis-low">0 ft</small></div><aside className="pitch-detail" aria-live="polite">{hovered?<><p><span/>{game[side].abbr} · {hovered.half} {hovered.inning}</p><h4>{hovered.type}</h4><strong>{hovered.call}</strong><dl><div><dt>Velocity</dt><dd>{hovered.speed?`${hovered.speed} mph`:'—'}</dd></div><div><dt>Count after pitch</dt><dd>{hovered.count||'—'}</dd></div><div><dt>Batter</dt><dd>{hovered.batter}</dd></div><div><dt>Location</dt><dd>{hovered.zone?`Zone ${hovered.zone}`:'Outside zone'}</dd></div></dl></>:<><p className="eyebrow">{pitcher?.name}</p><h4>{pitcher?.pitches.length||0} tracked pitches</h4><span>Hover a numbered pitch to inspect its type, result, velocity, count, and batter.</span></>}</aside></div></>:<p className="no-plays">Pitch locations will appear after this team takes the mound.</p>}</section>
}
function StatsTable({title,heads,rows}){return <section className="stats-wrap"><p className="eyebrow">{title}</p>{rows.length?<div className="stats-table"><div>{heads.map(h=><b key={h}>{h}</b>)}</div>{rows.map((row,i)=><div key={i}>{row.map((cell,j)=>j===0?<strong key={j}>{cell}</strong>:<span key={j}>{cell}</span>)}</div>)}</div>:<p className="no-plays">Statistics will appear after the game begins.</p>}</section>}
