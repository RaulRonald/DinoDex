// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GuessDinoPage from './pages/GuessDinoPage';

function App() {
  return (
    <BrowserRouter>
      <div className="text-stone-200">
        <Routes>
          {/* Rota para a página inicial */}
          <Route path="/" element={<HomePage />} />
          
          {/* Rota para a página do minigame */}
          <Route path="/guess" element={<GuessDinoPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;