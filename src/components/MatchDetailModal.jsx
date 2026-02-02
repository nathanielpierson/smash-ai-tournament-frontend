import Match from './Match';
import './MatchDetailModal.css';

/**
 * MatchDetailModal component that displays match details in a modal overlay
 */
function MatchDetailModal({ matchup, player1, player2, isWatched, onClose, onMatchComplete }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="match-modal-overlay" onClick={handleBackdropClick}>
      <div className="match-modal-content">
        <button className="match-modal-close" onClick={onClose}>
          ×
        </button>
        <Match
          matchup={matchup}
          player1={player1}
          player2={player2}
          onMatchComplete={onMatchComplete}
          isWatched={isWatched}
        />
      </div>
    </div>
  );
}

export default MatchDetailModal;
