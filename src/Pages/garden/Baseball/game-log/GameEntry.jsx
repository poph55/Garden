const TAG_LABEL = { playoffs: 'playoffs', 'world-series': 'world series' }

export default function GameEntry({ homeTeam, homeIcon, homeAbbr, homeScore, awayTeam, awayIcon, awayAbbr, awayScore, location, homeWin, date, tag }) {
  return (
    <div className="game-entry">
      <div className="game-matchup">
        <div className={`game-team-row ${!homeWin ? 'game-team-row--winner' : ''}`}>
          {awayIcon
            ? <img src={awayIcon} alt={awayTeam} className="game-team-icon" />
            : <span className="game-team-abbr-box">{awayAbbr ?? awayTeam.slice(0, 3).toUpperCase()}</span>
          }
          <span className="game-team-name">{awayAbbr ?? awayTeam}</span>
          <span className="game-score">{awayScore}</span>
        </div>
        <div className={`game-team-row ${homeWin ? 'game-team-row--winner' : ''}`}>
          {homeIcon
            ? <img src={homeIcon} alt={homeTeam} className="game-team-icon" />
            : <span className="game-team-abbr-box">{homeAbbr ?? homeTeam.slice(0, 3).toUpperCase()}</span>
          }
          <span className="game-team-name">{homeAbbr ?? homeTeam}</span>
          <span className="game-score">{homeScore}</span>
        </div>
      </div>
      <div className="game-meta">
        {tag && <span className={`game-tag game-tag--${tag}`}>{TAG_LABEL[tag]}</span>}
        <span className="game-location">{location}</span>
        <span className="game-date">{date}</span>
      </div>
    </div>
  )
}
