import baseballFieldIcon from '../../assets/baseball-field-Original.png'

export default function TeamsGrid({ divisions, icon, games, visibilityMode }) {
  const stats = games.reduce((acc, game) => {
    if (!acc[game.homeTeam]) acc[game.homeTeam] = { played: 0, wins: 0, homeGames: 0 }
    if (!acc[game.awayTeam]) acc[game.awayTeam] = { played: 0, wins: 0, homeGames: 0 }

    acc[game.homeTeam].played++
    acc[game.homeTeam].homeGames++
    if (game.homeWin) acc[game.homeTeam].wins++

    acc[game.awayTeam].played++
    if (!game.homeWin) acc[game.awayTeam].wins++

    return acc
  }, {})

  return (
    <div className="teams-grid">
      {divisions.flat().map(team => {
        const s = stats[team]
        const homeCount = s?.homeGames || 0
        const visited = visibilityMode === 'home' ? homeCount > 0 : s?.played > 0
        return (
          <div key={team} className={`team-cell${visited ? ' team-cell--visited' : ''}`}>
            {visited && (
              <span className="team-cell-record">
                {s.played} ({s.wins}-{s.played - s.wins})
              </span>
            )}
            {homeCount > 0 && (
              <span className="team-cell-count">
                <img src={baseballFieldIcon} alt="" className="team-cell-field-icon" aria-hidden="true" />
                {homeCount}
              </span>
            )}
            <img src={icon[team]} alt={team} className="team-cell-logo" />
          </div>
        )
      })}
    </div>
  )
}
