// src/App.jsx

import React from 'react';
// Trocamos BrowserRouter por HashRouter para funcionar no GitHub Pages
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GuessDinoPage from './pages/GuessDinoPage';

function App() {
  return (
    <HashRouter>
      <div className="text-stone-200">
        <Routes>
          {/* A definição das rotas continua a mesma */}
          <Route path="/" element={<HomePage />} />
          <Route path="/guess" element={<GuessDinoPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;