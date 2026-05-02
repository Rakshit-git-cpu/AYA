import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('[SW] Registered. Scope:', reg.scope);

        // Force check for a new SW version on every page load
        reg.update().catch(() => {/* non-critical */});

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              // New version activated — hard reload to serve latest build
              console.log('[SW] New version activated. Reloading...');
              window.location.reload();
            }
          });
        });
      })
      .catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
  });
}


// Global Error Handler moved to index.html for better coverage

console.log('[AYA Boot] localStorage aya_user_id:', 
  localStorage.getItem('aya_user_id'))
console.log('[AYA Boot] sessionStorage aya_user_id:', 
  sessionStorage.getItem('aya_user_id'))
console.log('[AYA Boot] Zustand persisted store:', 
  localStorage.getItem('aya-user-store'))
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
