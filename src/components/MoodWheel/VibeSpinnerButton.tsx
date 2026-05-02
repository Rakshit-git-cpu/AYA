import './VibeSpinnerButton.css';
import { useSpinCountdown } from '../../hooks/useSpinCountdown';

interface VibeSpinnerButtonProps {
  streak: number; // Retained prop for signature compatibility but unused in UI
  completed: boolean;
  spinsUsed?: number;
  onClick: () => void;
}

export function VibeSpinnerButton({ completed, spinsUsed = 0, onClick }: VibeSpinnerButtonProps) {
  const countdownString = useSpinCountdown();
  const isLocked = spinsUsed >= 2;

  return (
    <div className="vsb-wrapper">
      {!completed && !isLocked && (
        <>
          <div className="vsb-sparkle vsb-sp1" />
          <div className="vsb-sparkle vsb-sp2" />
          <div className="vsb-sparkle vsb-sp3" />
        </>
      )}
      <button
        className={`vsb-pill${completed ? ' vsb-completed' : ''}${isLocked ? ' vsb-locked' : ''}`}
        onClick={isLocked ? undefined : onClick}
        disabled={completed}
        aria-label="Open Vibe Spinner"
      >
        {isLocked ? (
          <div className="vibe-spinner-locked">
            <span className="spinner-lock-icon">🔒</span>
            <div className="spinner-locked-text">
              <span className="spinner-locked-title">NEXT SPIN IN</span>
              <span className="spinner-countdown">{countdownString}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Left: tiny spinning 3D mini-wheel */}
            <div className="vsb-mini-wheel-wrap">
              <div className="vsb-mini-wheel">
                <div className="vsb-wheel-face" />
                <div className="vsb-wheel-rim" />
                <div className="vsb-wheel-hub" />
              </div>
            </div>

            {/* Right: text */}
            <span className="vsb-title">
              {completed ? 'DONE TODAY' : 'VIBE SPINNER'}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
