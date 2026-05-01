import './VibeSpinnerButton.css';

interface VibeSpinnerButtonProps {
  streak: number; // Retained prop for signature compatibility but unused in UI
  completed: boolean;
  onClick: () => void;
}

export function VibeSpinnerButton({ completed, onClick }: VibeSpinnerButtonProps) {
  return (
    <div className="vsb-wrapper">
      {!completed && (
        <>
          <div className="vsb-sparkle vsb-sp1" />
          <div className="vsb-sparkle vsb-sp2" />
          <div className="vsb-sparkle vsb-sp3" />
        </>
      )}
      <button
        className={`vsb-pill${completed ? ' vsb-completed' : ''}`}
        onClick={onClick}
        disabled={completed}
        aria-label="Open Vibe Spinner"
      >
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
      </button>
    </div>
  );
}
