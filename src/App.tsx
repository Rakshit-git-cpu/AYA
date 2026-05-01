import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/Home';
import { GameRoot } from './pages/GameRoot';
import { bgmManager, BGM_TRACKS } from './utils/bgmManager';

function App() {
  useEffect(() => {
    bgmManager.loadPreference()
    
    // Preload all tracks immediately on app start
    // This happens silently in background
    bgmManager.preload(BGM_TRACKS)
    
    // Unlock on first user interaction
    const unlock = async () => {
      await bgmManager.unlock()
      document.removeEventListener('click', unlock, { capture: true })
      document.removeEventListener('touchstart', unlock, { capture: true })
    }
    
    document.addEventListener('click', unlock, { capture: true })
    document.addEventListener('touchstart', unlock, { capture: true })
    
    return () => {
      document.removeEventListener('click', unlock, { capture: true })
      document.removeEventListener('touchstart', unlock, { capture: true })
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GameRoot />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
