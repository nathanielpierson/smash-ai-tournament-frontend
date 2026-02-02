import { useState, useEffect } from 'react';
import BracketView from './BracketView';
import MatchDetailModal from './MatchDetailModal';
import { fetchTournamentData } from '../services/tournamentApi';
import { getBracketAndRound, getRoundKey, parseRoundKey } from '../utils/tournamentUtils';
import './TournamentBracket.css';

/**
 * TournamentBracket component that displays bracket view with round navigation
 * Clicking on a matchup opens a modal with match details
 */
function TournamentBracket() {
  const [tournamentData, setTournamentData] = useState(null);
  const [watchedMatches, setWatchedMatches] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBracket, setCurrentBracket] = useState('winners');
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedMatchup, setSelectedMatchup] = useState(null);

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

  const handleMatchupClick = (matchup) => {
    setSelectedMatchup(matchup);
  };

  const handleCloseModal = () => {
    setSelectedMatchup(null);
  };

  // Group matchups by bracket and round (only if tournamentData exists and has matchups)
  const matchupsByBracketAndRound = tournamentData && tournamentData.matchups
    ? tournamentData.matchups.reduce((acc, matchup) => {
        const { bracket, round } = getBracketAndRound(matchup.number || matchup.id);
        const key = getRoundKey(bracket, round);
        if (!acc[key]) {
          acc[key] = {
            bracket,
            round,
            matchups: [],
            displayName: getBracketAndRound(matchup.number || matchup.id).displayName,
          };
        }
        acc[key].matchups.push(matchup);
        return acc;
      }, {})
    : {};

  // Get available rounds for each bracket
  const winnersRounds = Object.values(matchupsByBracketAndRound)
    .filter(r => r.bracket === 'winners')
    .sort((a, b) => a.round - b.round);
  
  const losersRounds = Object.values(matchupsByBracketAndRound)
    .filter(r => r.bracket === 'losers')
    .sort((a, b) => a.round - b.round);
  
  const finalRounds = Object.values(matchupsByBracketAndRound)
    .filter(r => r.bracket === 'final')
    .sort((a, b) => a.round - b.round);

  // Ensure currentBracket and currentRound are valid - must be before early returns (Rules of Hooks)
  useEffect(() => {
    const availableRounds = currentBracket === 'winners' ? winnersRounds
      : currentBracket === 'losers' ? losersRounds
      : finalRounds;
    
    if (availableRounds.length > 0) {
      const currentKey = getRoundKey(currentBracket, currentRound);
      const hasCurrentRound = availableRounds.some(r => getRoundKey(r.bracket, r.round) === currentKey);
      
      if (!hasCurrentRound) {
        setCurrentRound(availableRounds[0].round);
      }
    }
  }, [winnersRounds, losersRounds, finalRounds, currentBracket, currentRound]);

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

  // Create a map of contestants by ID for quick lookup
  const contestantsMap = tournamentData && tournamentData.contestants
    ? tournamentData.contestants.reduce((acc, contestant) => {
        acc[contestant.id] = contestant;
        return acc;
      }, {})
    : {};

  const currentRoundKey = getRoundKey(currentBracket, currentRound);
  const currentRoundData = matchupsByBracketAndRound[currentRoundKey];
  const currentRoundMatchups = currentRoundData ? currentRoundData.matchups : [];

  const handleBracketChange = (bracket) => {
    setCurrentBracket(bracket);
    // Reset to first round of the selected bracket
    const availableRounds = bracket === 'winners' ? winnersRounds
      : bracket === 'losers' ? losersRounds
      : finalRounds;
    if (availableRounds.length > 0) {
      setCurrentRound(availableRounds[0].round);
    }
  };

  const handleRoundChange = (bracket, round) => {
    setCurrentBracket(bracket);
    setCurrentRound(round);
  };

  return (
    <div className="tournament-bracket">
      <div className="tournament-header">
        <h1>Tournament Bracket</h1>
        <p className="tournament-subtitle">
          Click on a matchup to view match details
        </p>
      </div>

      <div className="bracket-navigation">
        <div className="bracket-selector">
          <button
            className={`bracket-button ${currentBracket === 'winners' ? 'active' : ''}`}
            onClick={() => handleBracketChange('winners')}
          >
            Winner's Bracket
          </button>
          <button
            className={`bracket-button ${currentBracket === 'losers' ? 'active' : ''}`}
            onClick={() => handleBracketChange('losers')}
          >
            Loser's Bracket
          </button>
          {finalRounds.length > 0 && (
            <button
              className={`bracket-button ${currentBracket === 'final' ? 'active' : ''}`}
              onClick={() => handleBracketChange('final')}
            >
              Final
            </button>
          )}
        </div>
        <div className="round-navigation">
          {currentBracket === 'winners' && winnersRounds.map((roundData) => {
            const isActive = roundData.round === currentRound;
            return (
              <button
                key={getRoundKey(roundData.bracket, roundData.round)}
                className={`round-nav-button ${isActive ? 'active' : ''}`}
                onClick={() => handleRoundChange(roundData.bracket, roundData.round)}
              >
                Round {roundData.round}
              </button>
            );
          })}
          {currentBracket === 'losers' && losersRounds.map((roundData) => {
            const isActive = roundData.round === currentRound;
            return (
              <button
                key={getRoundKey(roundData.bracket, roundData.round)}
                className={`round-nav-button ${isActive ? 'active' : ''}`}
                onClick={() => handleRoundChange(roundData.bracket, roundData.round)}
              >
                Round {roundData.round}
              </button>
            );
          })}
          {currentBracket === 'final' && finalRounds.map((roundData) => {
            const isActive = roundData.round === currentRound;
            return (
              <button
                key={getRoundKey(roundData.bracket, roundData.round)}
                className={`round-nav-button ${isActive ? 'active' : ''}`}
                onClick={() => handleRoundChange(roundData.bracket, roundData.round)}
              >
                Final
              </button>
            );
          })}
        </div>
      </div>

      <BracketView
        matchups={currentRoundMatchups}
        contestantsMap={contestantsMap}
        watchedMatches={watchedMatches}
        onMatchupClick={handleMatchupClick}
        currentRound={currentRound}
        bracketType={currentBracket}
        roundDisplayName={currentRoundData?.displayName || ''}
      />

      {selectedMatchup && (
        <MatchDetailModal
          matchup={selectedMatchup}
          player1={contestantsMap[selectedMatchup.contestant_one_id]}
          player2={contestantsMap[selectedMatchup.contestant_two_id]}
          isWatched={watchedMatches.has(selectedMatchup.id)}
          onClose={handleCloseModal}
          onMatchComplete={handleMatchComplete}
        />
      )}
    </div>
  );
}

export default TournamentBracket;
