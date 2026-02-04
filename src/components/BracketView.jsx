import './BracketView.css';

/**
 * BracketView component that displays a tournament bracket structure
 * Similar to Challonge's bracket visualization
 */
function BracketView({ matchups, contestantsMap, watchedMatches, onMatchupClick, currentRound, bracketType, roundDisplayName }) {
  // Sort matchups by number (hardcoded field) for consistent display
  const sortedMatchups = [...matchups].sort((a, b) => (a.number || 0) - (b.number || 0));

  const getContestantName = (contestantId) => {
    if (!contestantId) return 'TBD';
    const contestant = contestantsMap[contestantId];
    // Debug: Log when we can't find a contestant
    if (!contestant) {
      console.log(`Contestant not found for ID: ${contestantId}, available IDs:`, Object.keys(contestantsMap));
    }
    return contestant?.name || 'TBD';
  };

  const getWinnerId = (matchup) => {
    if (!matchup.outcome) return null;
    const outcomeStr = String(matchup.outcome);
    if (outcomeStr === String(matchup.contestant_one_id)) return matchup.contestant_one_id;
    if (outcomeStr === String(matchup.contestant_two_id)) return matchup.contestant_two_id;
    return null;
  };

  return (
    <div className="bracket-view">
      <div className="bracket-round-header">
        <h2>{roundDisplayName || `Round ${currentRound}`}</h2>
      </div>
      <div className="bracket-matches">
        {sortedMatchups.map((matchup) => {
          const player1 = contestantsMap[matchup.contestant_one_id];
          const player2 = contestantsMap[matchup.contestant_two_id];
          const isWatched = watchedMatches.has(matchup.number);
          const winnerId = getWinnerId(matchup);
          const player1Won = winnerId === matchup.contestant_one_id;
          const player2Won = winnerId === matchup.contestant_two_id;
          const hasResult = isWatched && winnerId !== null;

          return (
            <div
              key={matchup.id}
              className={`bracket-matchup ${hasResult ? 'matchup-complete' : ''} ${isWatched ? 'matchup-watched' : ''}`}
              onClick={() => onMatchupClick(matchup)}
            >
              <div className="matchup-number">#{matchup.number}</div>
              <div className="matchup-contestants">
                <div
                  className={`matchup-contestant ${player1Won ? 'winner' : ''} ${hasResult && !player1Won ? 'loser' : ''}`}
                >
                  {getContestantName(matchup.contestant_one_id)}
                </div>
                <div className="matchup-vs">vs</div>
                <div
                  className={`matchup-contestant ${player2Won ? 'winner' : ''} ${hasResult && !player2Won ? 'loser' : ''}`}
                >
                  {getContestantName(matchup.contestant_two_id)}
                </div>
              </div>
              {hasResult && (
                <div className="matchup-result-indicator">
                  <span className="result-badge">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BracketView;
