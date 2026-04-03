import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/Home';
import { GameRoot } from './pages/GameRoot';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GameRoot />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  )
}

export default App
