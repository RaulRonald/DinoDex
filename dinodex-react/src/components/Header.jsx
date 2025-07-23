// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Importe o Link

const Header = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="bg-stone-900/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        {/* Link no título para voltar para a home */}
        <Link to="/">
          <h1 className="text-4xl font-bold text-center text-stone-100 mb-4 tracking-wider hover:text-amber-500 transition-colors">DinoDEX</h1>
        </Link>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {/* BARRA DE BUSCA */}
          <input
            type="search"
            placeholder="Buscar dinossauro pelo nome..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 bg-stone-700 border border-stone-600 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-200 placeholder-stone-400"
          />
          {/* BOTÃO PARA O MINIGAME */}
          <Link to="/guess">
            <button className="px-5 py-2 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all transform hover:scale-105 whitespace-nowrap">
              Adivinhe o DINO 🎮
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;