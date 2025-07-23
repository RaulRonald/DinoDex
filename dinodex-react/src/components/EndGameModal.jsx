// src/components/EndGameModal.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

const EndGameModal = ({ gameState, correctDinoName, onPlayAgain }) => {
  if (gameState !== 'won' && gameState !== 'lost') {
    return null;
  }

  const isWinner = gameState === 'won';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {isWinner && <Confetti recycle={false} numberOfPieces={400} />}
      
      <div className={`p-8 rounded-lg border-2 w-full max-w-md text-center shadow-2xl ${isWinner ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
        <h2 className={`text-5xl font-bold ${isWinner ? 'text-green-300' : 'text-red-300'}`}>
          {isWinner ? 'Parabéns!' : 'Não foi desta vez...'}
        </h2>
        
        <p className="text-white text-xl mt-4">
          {isWinner ? 'Você desenterrou o dinossauro correto!' : 'O dinossauro era:'}
        </p>
        <p className="text-amber-400 text-3xl font-bold mt-2">{correctDinoName}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button 
            onClick={onPlayAgain}
            className="px-6 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-all text-lg"
          >
            Jogar Novamente
          </button>
          <Link to="/" className="px-6 py-3 bg-stone-600 text-white font-bold rounded-full hover:bg-stone-700 transition-all text-lg flex items-center justify-center">
            Voltar ao DinoDEX
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EndGameModal;