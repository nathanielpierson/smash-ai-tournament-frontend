import { useState, useRef, useEffect } from 'react';
import { convertToEmbedUrl } from '../utils/youtubeUtils';
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
      onMatchComplete(matchup.number);
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

  // Convert YouTube URL to embed format
  const embedUrl = matchup.youtube_url ? convertToEmbedUrl(matchup.youtube_url) : null;

  // Determine winner/loser from outcome string like "2-0"
  const parseOutcome = (outcome) => {
    if (!outcome) return null;
    const parts = String(outcome).split('-');
    if (parts.length !== 2) return null;
    const wins1 = Number(parts[0]);
    const wins2 = Number(parts[1]);
    if (!Number.isFinite(wins1) || !Number.isFinite(wins2)) return null;
    if (wins1 === wins2) return null;
    return {
      wins1,
      wins2,
      winnerKey: wins1 > wins2 ? 'player1' : 'player2',
    };
  };

  const outcomeInfo = parseOutcome(matchup.outcome);
  const winner =
    outcomeInfo?.winnerKey === 'player1'
      ? player1
      : outcomeInfo?.winnerKey === 'player2'
      ? player2
      : null;
  const loser =
    outcomeInfo?.winnerKey === 'player1'
      ? player2
      : outcomeInfo?.winnerKey === 'player2'
      ? player1
      : null;

  return (
    <div className={`match ${showResult ? 'match-complete' : ''}`}>
      <div className="match-header">
        <h3>Match {matchup.number}</h3>
        {!showResult && (
          <button className="skip-button" onClick={handleSkip}>
            Skip
          </button>
        )}
      </div>

      <div className="match-video">
        {!showResult ? (
          <>
            <p className="watch-prompt">Watch the match below, then click "Skip" to reveal the result.
              Or don't watch it and click "Skip" to spoil yourself. I won't judge you.</p>
            <div className="video-container">
              {embedUrl ? (
                <iframe
                  ref={iframeRef}
                  width="560"
                  height="315"
                  src={`${embedUrl}?enablejsapi=1`}
                  title={`Match ${matchup.number}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={handleVideoStart}
                ></iframe>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No video URL available for this match
                </div>
              )}
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
              {embedUrl ? (
                <iframe
                  width="560"
                  height="315"
                  src={embedUrl}
                  title={`Match ${matchup.number}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No video URL available for this match
                </div>
              )}
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
