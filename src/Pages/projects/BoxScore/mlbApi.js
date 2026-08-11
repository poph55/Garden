const MLB_API = 'https://statsapi.mlb.com/api'
const responseCache = new Map()

function endpoint(resource, params = {}) {
  if (import.meta.env.DEV) {
    if (resource === 'schedule') {
      const search = new URLSearchParams({ sportId: '1', date: params.date, hydrate: 'team,linescore,venue' })
      return `${MLB_API}/v1/schedule?${search}`
    }
    if (resource === 'venue') return `${MLB_API}/v1/venues/${params.id}?hydrate=fieldInfo`
    return `${MLB_API}/v1.1/game/${params.id}/feed/live`
  }
  return `/api/mlb?${new URLSearchParams({ resource, ...params })}`
}

async function requestJson(url, { signal, ttl = 30_000 } = {}) {
  const cached = responseCache.get(url)
  if (cached && Date.now() - cached.savedAt < ttl) return cached.data
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`MLB data request failed (${response.status})`)
  const data = await response.json()
  responseCache.set(url, { data, savedAt: Date.now() })
  return data
}

const TEAM_COLORS = {
  ARI:'#a71930', ATL:'#ce1141', BAL:'#df4601', BOS:'#bd3039', CHC:'#0e3386', CWS:'#27251f', CIN:'#c6011f', CLE:'#00385d', COL:'#33006f', DET:'#0c2340', HOU:'#002d62', KC:'#004687', LAA:'#ba0021', LAD:'#005a9c', MIA:'#00a3e0', MIL:'#12284b', MIN:'#002b5c', NYM:'#002d72', NYY:'#132448', OAK:'#003831', PHI:'#e81828', PIT:'#27251f', SD:'#2f241d', SEA:'#0c2c56', SF:'#fd5a1e', STL:'#c41e3a', TB:'#092c5c', TEX:'#003278', TOR:'#134a8e', WSH:'#ab0003'
}

function teamFromSchedule(team, stats = {}) {
  const abbr = team.abbreviation || team.teamCode?.toUpperCase() || team.name.slice(0, 3).toUpperCase()
  const parts = team.name.split(' ')
  return { id: team.id, city: team.locationName || parts.slice(0, -1).join(' '), name: team.teamName || parts.at(-1), abbr, color: TEAM_COLORS[abbr] || '#30443b', score: stats.runs ?? 0, hits: stats.hits ?? 0, errors: stats.errors ?? 0, innings: [] }
}

function statusLabel(status) {
  if (status.abstractGameState === 'Final') return 'FINAL'
  if (status.abstractGameState === 'Live') return status.inningState?.toUpperCase() || 'LIVE'
  return status.detailedState?.toUpperCase() || 'SCHEDULED'
}

export async function getSchedule(date, signal) {
  const data = await requestJson(endpoint('schedule', { date }), { signal, ttl: 60_000 })
  return (data.dates?.[0]?.games || []).map(game => ({
    id: game.gamePk,
    date: new Date(game.gameDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
    status: statusLabel(game.status),
    away: teamFromSchedule(game.teams.away.team, game.linescore?.teams?.away),
    home: teamFromSchedule(game.teams.home.team, game.linescore?.teams?.home)
  }))
}

function getTeam(teamData, stats, innings, side) {
  const team = teamFromSchedule(teamData, stats)
  team.innings = innings.map(inning => inning[side]?.runs ?? (inning[side] ? 0 : '—'))
  return team
}

function playerRows(boxscore, type, abbreviations) {
  const rows = { away: [], home: [] }
  for (const side of ['away', 'home']) {
    const team = boxscore.teams?.[side]
    for (const player of Object.values(team?.players || {})) {
      if (type === 'batting') {
        const s = player.stats?.batting
        if (!s || (!s.atBats && !s.baseOnBalls)) continue
        rows[side].push({ sort: (s.rbi || 0) * 10 + (s.hits || 0), cells: [player.person.fullName, player.position?.abbreviation || '—', s.atBats ?? 0, s.runs ?? 0, s.hits ?? 0, s.rbi ?? 0, s.baseOnBalls ?? 0] })
      } else {
        const s = player.stats?.pitching
        if (!s?.inningsPitched) continue
        rows[side].push({ sort: Number.parseFloat(s.inningsPitched), cells: [player.person.fullName, abbreviations[side], s.inningsPitched, s.hits ?? 0, s.earnedRuns ?? 0, s.baseOnBalls ?? 0, s.strikeOuts ?? 0] })
      }
    }
  }
  return Object.fromEntries(Object.entries(rows).map(([side, teamRows]) => [side, teamRows.sort((a, b) => b.sort - a.sort).map(row => row.cells)]))
}

function winProbabilityTimeline(liveData, gameData) {
  const plays = (liveData.plays?.allPlays || []).filter(play => play.about?.isComplete)
  const final = gameData.status.abstractGameState === 'Final'
  const points = [{ home: 52, inning: 1, half: 'TOP', label: 'First pitch' }]

  for (const play of plays) {
    const inning = play.about.inning || 1
    const isTop = play.about.isTopInning
    const progress = Math.min(1, ((inning - 1) * 2 + (isTop ? 0.7 : 1.7)) / 18)
    const remaining = Math.max(0.45, (1 - progress) * 4.5)
    const margin = (play.result.homeScore || 0) - (play.result.awayScore || 0)
    const homeField = 0.08 * (1 - progress)
    const home = Math.round(100 / (1 + Math.exp(-(margin * 1.15 / Math.sqrt(remaining) + homeField))))
    points.push({ home: Math.max(1, Math.min(99, home)), inning, half: isTop ? 'TOP' : 'BOT', label: play.result.event || 'Plate appearance' })
  }

  if (final && points.length > 1) points[points.length - 1].home = liveData.linescore?.teams?.home?.runs > liveData.linescore?.teams?.away?.runs ? 100 : 0
  return points
}

function sprayChartData(liveData, gameData) {
  const hits = { away: [], home: [] }
  for (const play of liveData.plays?.allPlays || []) {
    const event = [...(play.playEvents || [])].reverse().find(item => item.hitData?.coordinates?.coordX != null && item.hitData?.coordinates?.coordY != null)
    if (!event) continue
    const side = play.about.isTopInning ? 'away' : 'home'
    hits[side].push({
      id: event.playId || `${play.about.atBatIndex}-${event.index}`,
      side,
      team: gameData.teams[side].abbreviation,
      batter: play.matchup?.batter?.fullName || 'Unknown batter',
      result: play.result?.event || event.details?.event || 'Ball in play',
      outcome: ({ Single:'1b', Double:'2b', Triple:'3b', 'Home Run':'hr' })[play.result?.event] || 'out',
      description: play.result?.description || '',
      inning: play.about.inning,
      half: play.about.isTopInning ? 'TOP' : 'BOT',
      x: event.hitData.coordinates.coordX,
      y: event.hitData.coordinates.coordY,
      exitVelocity: event.hitData.launchSpeed,
      launchAngle: event.hitData.launchAngle,
      distance: event.hitData.totalDistance,
      trajectory: event.hitData.trajectory
    })
  }
  return hits
}

function pitchLocationData(liveData, gameData) {
  const teams = { away: [], home: [] }
  const pitchers = new Map()
  for (const play of liveData.plays?.allPlays || []) {
    const side = play.about?.isTopInning ? 'home' : 'away'
    const pitcher = play.matchup?.pitcher
    if (!pitcher?.id) continue
    const key = `${side}-${pitcher.id}`
    if (!pitchers.has(key)) {
      const entry = { id: pitcher.id, side, team: gameData.teams[side].abbreviation, name: pitcher.fullName || 'Unknown pitcher', pitches: [] }
      pitchers.set(key, entry)
      teams[side].push(entry)
    }
    const entry = pitchers.get(key)
    for (const event of play.playEvents || []) {
      const coordinates = event.pitchData?.coordinates
      if (!event.isPitch || coordinates?.pX == null || coordinates?.pZ == null) continue
      entry.pitches.push({
        id: event.playId || `${play.about.atBatIndex}-${event.index}`,
        number: entry.pitches.length + 1, x: coordinates.pX, z: coordinates.pZ,
        batter: play.matchup?.batter?.fullName || 'Unknown batter', inning: play.about?.inning,
        half: play.about?.isTopInning ? 'TOP' : 'BOT', type: event.details?.type?.description || 'Pitch',
        call: event.details?.call?.description || event.details?.description || 'Result unavailable',
        speed: event.pitchData?.startSpeed, zone: event.pitchData?.zone,
        count: event.count ? `${event.count.balls ?? 0}-${event.count.strikes ?? 0}` : null
      })
    }
  }
  return teams
}

function playerContributions(boxscore, gameData) {
  const contributions = []
  for (const side of ['away', 'home']) {
    for (const player of Object.values(boxscore.teams?.[side]?.players || {})) {
      const batting = player.stats?.batting || {}
      const pitching = player.stats?.pitching || {}
      const battingScore = (batting.runs || 0) * 2.5 + (batting.rbi || 0) * 2.5 + (batting.hits || 0) * 1.5 + (batting.doubles || 0) + (batting.triples || 0) * 2 + (batting.homeRuns || 0) * 2.5 + (batting.baseOnBalls || 0) * .75 + (batting.stolenBases || 0) * 1.25
      const outs = Number.parseFloat(pitching.inningsPitched || 0) * 3
      const pitchingScore = outs * .55 + (pitching.strikeOuts || 0) * .8 - (pitching.earnedRuns || 0) * 2 - (pitching.hits || 0) * .35 - (pitching.baseOnBalls || 0) * .45 + (pitching.wins || 0) * 2 + (pitching.saves || 0) * 2
      const score = battingScore + pitchingScore
      if (score <= 0 || (!batting.plateAppearances && !pitching.inningsPitched)) continue
      const details = []
      if (batting.plateAppearances) details.push(`${batting.hits || 0}-${batting.atBats || 0}, ${batting.runs || 0} R, ${batting.rbi || 0} RBI`)
      if (pitching.inningsPitched) details.push(`${pitching.inningsPitched} IP, ${pitching.strikeOuts || 0} K, ${pitching.earnedRuns || 0} ER`)
      contributions.push({
        id: player.person.id, name: player.person.fullName, side,
        team: gameData.teams[side].abbreviation, position: player.position?.abbreviation || '—',
        score: Math.round(score * 10) / 10, detail: details.join(' · ')
      })
    }
  }
  return contributions.sort((a, b) => b.score - a.score).slice(0, 8)
}

export async function getGame(gamePk, signal) {
  const data = await requestJson(endpoint('game', { id: String(gamePk) }), { signal, ttl: 20_000 })
  const { gameData, liveData } = data
  const venueData = gameData.venue?.id ? await requestJson(endpoint('venue', { id: String(gameData.venue.id) }), { signal, ttl: 86_400_000 }).catch(() => null) : null
  const fieldInfo = venueData?.venues?.[0]?.fieldInfo
  const innings = liveData.linescore?.innings || []
  const scoringPlays = (liveData.plays?.scoringPlays || []).map(index => liveData.plays.allPlays[index]).filter(Boolean).reverse().slice(0, 6)
  const duration = gameData.gameInfo?.gameDurationMinutes
  return {
    id: gameData.game.pk,
    date: new Date(gameData.datetime.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
    venue: gameData.venue?.name || 'Venue TBD', status: statusLabel(gameData.status),
    park: fieldInfo ? {
      name: gameData.venue?.name || venueData.venues[0].name,
      leftLine: Number(fieldInfo.leftLine), leftCenter: Number(fieldInfo.leftCenter),
      center: Number(fieldInfo.center), rightCenter: Number(fieldInfo.rightCenter), rightLine: Number(fieldInfo.rightLine)
    } : null,
    duration: duration ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}` : '—',
    weather: gameData.weather ? {
      condition: gameData.weather.condition || 'Conditions unavailable',
      temperature: gameData.weather.temp,
      wind: gameData.weather.wind || 'Wind unavailable'
    } : null,
    away: getTeam(gameData.teams.away, liveData.linescore?.teams?.away || {}, innings, 'away'),
    home: getTeam(gameData.teams.home, liveData.linescore?.teams?.home || {}, innings, 'home'),
    note: scoringPlays[0]?.result?.description || (gameData.status.abstractGameState === 'Preview' ? 'First pitch has not been thrown yet.' : 'Follow the inning-by-inning scoring below.'),
    plays: scoringPlays.map(play => ({ inn: String(play.about.inning), side: play.about.halfInning === 'top' ? 'TOP' : 'BOT', label: play.result.event || 'Scoring play', detail: play.result.description, runs: play.result.rbi || 1 })),
    winProbability: winProbabilityTimeline(liveData, gameData),
    sprayHits: sprayChartData(liveData, gameData),
    pitchLocations: pitchLocationData(liveData, gameData),
    contributions: playerContributions(liveData.boxscore, gameData),
    batters: playerRows(liveData.boxscore, 'batting', { away: gameData.teams.away.abbreviation, home: gameData.teams.home.abbreviation }),
    pitchers: playerRows(liveData.boxscore, 'pitching', { away: gameData.teams.away.abbreviation, home: gameData.teams.home.abbreviation })
  }
}
