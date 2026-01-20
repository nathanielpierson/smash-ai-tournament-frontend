import { useState, useEffect } from 'react';
import Match from './Match';
import { fetchTournamentData } from '../services/tournamentApi';
import './TournamentBracket.css';

/**
 * TournamentBracket component that displays all matches organized by rounds
 */
function TournamentBracket() {
  const [tournamentData, setTournamentData] = useState(null);
  const [watchedMatches, setWatchedMatches] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTournamentData();
    // Load watched matches from localStorage
    const saved = localStorage.getItem('watchedMatches');
    if (saved) {
      setWatchedMatches(new Set(JSON.parse(saved)));
    }
  }, []);

  const loadTournamentData = async () => {
    try {
      setLoading(true);
      const data = await fetchTournamentData();
      setTournamentData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchComplete = (matchupId) => {
    const updated = new Set(watchedMatches);
    updated.add(matchupId);
    setWatchedMatches(updated);
    // Save to localStorage
    localStorage.setItem('watchedMatches', JSON.stringify(Array.from(updated)));
  };

  if (loading) {
    return (
      <div className="tournament-loading">
        <div className="spinner"></div>
        <p>Loading tournament data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournament-error">
        <p>Error loading tournament: {error}</p>
        <button onClick={loadTournamentData}>Retry</button>
      </div>
    );
  }

  if (!tournamentData) {
    return <div className="tournament-error">No tournament data available</div>;
  }

  // Group matchups by round
  const matchupsByRound = tournamentData.matchups.reduce((acc, matchup) => {
    if (!acc[matchup.round]) {
      acc[matchup.round] = [];
    }
    acc[matchup.round].push(matchup);
    return acc;
  }, {});

  const rounds = Object.keys(matchupsByRound).sort((a, b) => a - b);
  const maxRound = Math.max(...rounds.map(Number));

  // Create a map of contenders by ID for quick lookup
  const contendersMap = tournamentData.contenders.reduce((acc, contender) => {
    acc[contender.id] = contender;
    return acc;
  }, {});

  return (
    <div className="tournament-bracket">
      <div className="tournament-header">
        <h1>Tournament Bracket</h1>
        <p className="tournament-subtitle">
          Watch matches to reveal results, or skip to see them immediately
        </p>
      </div>

      <div className="bracket-container">
        {rounds.map((round) => {
          const roundNumber = Number(round);
          const matchups = matchupsByRound[round];
          const isFinal = roundNumber === maxRound;

          return (
            <div key={round} className={`round round-${roundNumber} ${isFinal ? 'final' : ''}`}>
              <div className="round-header">
                <h2>
                  {isFinal
                    ? 'Final'
                    : roundNumber === maxRound - 1
                    ? 'Semi-Finals'
                    : roundNumber === maxRound - 2
                    ? 'Quarter-Finals'
                    : `Round ${roundNumber}`}
                </h2>
              </div>
              <div className="matches-container">
                {matchups.map((matchup) => {
                  const player1 = contendersMap[matchup.player1Id];
                  const player2 = contendersMap[matchup.player2Id];
                  const isWatched = watchedMatches.has(matchup.id);

                  return (
                    <Match
                      key={matchup.id}
                      matchup={matchup}
                      player1={player1}
                      player2={player2}
                      onMatchComplete={handleMatchComplete}
                      isWatched={isWatched}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TournamentBracket;
