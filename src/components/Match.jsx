import { useState, useRef, useEffect } from 'react';
import './Match.css';

/**
 * Match component that displays a YouTube video embed
 * Results are hidden until the user watches the video or clicks skip
 */
function Match({ matchup, player1, player2, onMatchComplete, isWatched }) {
  const [showResult, setShowResult] = useState(isWatched);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);

  // Check if video has been watched (using YouTube API or time-based detection)
  useEffect(() => {
    if (isWatched) {
      setShowResult(true);
    }
  }, [isWatched]);

  const handleSkip = () => {
    setShowResult(true);
    setIsPlaying(false);
    if (onMatchComplete) {
      onMatchComplete(matchup.id);
    }
  };

  const handleVideoStart = () => {
    setIsPlaying(true);
  };

  // Listen for video end (approximate detection)
  useEffect(() => {
    if (!iframeRef.current || !isPlaying) return;

    const checkVideoProgress = () => {
      // Note: YouTube iframe API would be needed for accurate progress tracking
      // This is a simplified version
    };

    const interval = setInterval(checkVideoProgress, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // outcome is a string, so we need to compare it as a string
  const winnerId = matchup.outcome ? String(matchup.outcome) : null;
  const winner = winnerId === String(player1?.id) ? player1 : winnerId === String(player2?.id) ? player2 : null;
  const loser = winnerId === String(player1?.id) ? player2 : winnerId === String(player2?.id) ? player1 : null;

  return (
    <div className={`match ${showResult ? 'match-complete' : ''}`}>
      <div className="match-header">
        <h3>Match {matchup.number || matchup.id}</h3>
        {!showResult && (
          <button className="skip-button" onClick={handleSkip}>
            Skip
          </button>
        )}
      </div>

      <div className="match-video">
        {!showResult ? (
          <>
            <p className="watch-prompt">Watch the match below, then click "Skip" to reveal the result</p>
            <div className="video-container">
              <iframe
                ref={iframeRef}
                width="560"
                height="315"
                src={`${matchup.youtube_url}?enablejsapi=1`}
                title={`Match ${matchup.number || matchup.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoStart}
              ></iframe>
            </div>
          </>
        ) : (
          <div className="match-result">
            <div className="result-content">
              <div className="winner">
                <span className="winner-label">Winner:</span>
                <span className="winner-name">{winner?.name}</span>
              </div>
              <div className="loser">
                <span className="loser-label">Defeated:</span>
                <span className="loser-name">{loser?.name}</span>
              </div>
            </div>
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src={matchup.youtube_url}
                title={`Match ${matchup.number || matchup.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>

      <div className="match-players">
        <div className={`player ${showResult && winner?.id === player1?.id ? 'winner' : ''} ${showResult && loser?.id === player1?.id ? 'loser' : ''}`}>
          {player1?.name || 'TBD'}
        </div>
        <div className="vs">vs</div>
        <div className={`player ${showResult && winner?.id === player2?.id ? 'winner' : ''} ${showResult && loser?.id === player2?.id ? 'loser' : ''}`}>
          {player2?.name || 'TBD'}
        </div>
      </div>
    </div>
  );
}

export default Match;
