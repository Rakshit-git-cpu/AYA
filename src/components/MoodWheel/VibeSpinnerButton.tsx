import './VibeSpinnerButton.css';

interface VibeSpinnerButtonProps {
  streak: number;
  completed: boolean;
  onClick: () => void;
}

export function VibeSpinnerButton({ streak, completed, onClick }: VibeSpinnerButtonProps) {
  return (
    <button
      className={`vsb-pill${completed ? ' vsb-completed' : ''}`}
      onClick={onClick}
      disabled={completed}
      aria-label="Open Vibe Spinner"
    >
      {/* Left: tiny spinning 3D mini-wheel */}
      <div className={`vsb-mini-wheel-wrap${completed ? ' vsb-wheel-dim' : ''}`}>
        <div className="vsb-mini-wheel">
          {/* CSS conic-gradient wheel face */}
          <div className="vsb-wheel-face" />
          {/* Gold ring rim */}
          <div className="vsb-wheel-rim" />
          {/* Hub dot */}
          <div className="vsb-wheel-hub" />
        </div>
        {/* Bottom depth edge */}
        <div className="vsb-mini-wheel-edge" />
      </div>

      {/* Right: text */}
      <div className="vsb-text-col">
        <span className="vsb-title">
          {completed ? 'DONE TODAY' : 'VIBE SPINNER'}
        </span>
        <span className="vsb-streak">
          {completed ? '✓ CHALLENGE COMPLETE' : `🔥 ${streak} DAY STREAK`}
        </span>
      </div>
    </button>
  );
}
