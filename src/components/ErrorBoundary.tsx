import React from 'react';

interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('[AYA Error Boundary]:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          color: 'white',
          padding: '24px',
          textAlign: 'center',
          gap: '20px',
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h2 style={{ color: '#00E5FF', fontSize: '22px' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
            Don't worry — your progress is saved.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '800',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#0a0a0f',
              touchAction: 'manipulation',
            }}
          >
            TAP TO RELOAD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
