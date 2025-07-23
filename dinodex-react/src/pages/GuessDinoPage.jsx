// src/pages/GuessDinoPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EndGameModal from '../components/EndGameModal';

const API_URL = 'https://dinosaur-facts-api.shultzlab.com/dinosaurs';
const MAX_MISTAKES = 5;

const GuessDinoPage = () => {
  const [allDinos, setAllDinos] = useState([]);
  const [correctDino, setCorrectDino] = useState(null);
  const [dinoImage, setDinoImage] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [gameState, setGameState] = useState('loading'); // loading, playing, won, lost
  const [showHelp, setShowHelp] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState([]);

  const fetchDinoImage = useCallback(async (dinoName) => {
    const queryName = dinoName.split(' ')[0];
    const WIKIPEDIA_API_URL = `https://en.wikipedia.org/w/api.php?action=query&titles=${queryName}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    try {
      const response = await fetch(WIKIPEDIA_API_URL);
      const data = await response.json();
      const pages = data.query.pages;
      const page = pages[Object.keys(pages)[0]];
      if (page.pageid && page.thumbnail && page.thumbnail.source) {
        return page.thumbnail.source;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, []);

  const startGame = useCallback(async (dinos) => {
    setGameState('loading');
    setMistakes(0);
    setRevealedLetters([]);
    setUserGuess('');
    setShowHelp(false);
    setDinoImage(null);

    let foundDinoWithImage = null;
    while (!foundDinoWithImage) {
      const randomIndex = Math.floor(Math.random() * dinos.length);
      const randomDino = dinos[randomIndex];
      const imageUrl = await fetchDinoImage(randomDino.Name);
      if (imageUrl) {
        foundDinoWithImage = randomDino;
        setDinoImage(imageUrl);
      }
    }
    setCorrectDino(foundDinoWithImage);
    setGameState('playing');
  }, [fetchDinoImage]);

  useEffect(() => {
    const fetchAllDinos = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      setAllDinos(data);
      startGame(data);
    };
    fetchAllDinos();
  }, [startGame]);

  const revealRandomLetter = () => {
    const name = correctDino.Name.toLowerCase();
    const unrevealedIndices = [];
    for (let i = 0; i < name.length; i++) {
      if (name[i] !== ' ' && !revealedLetters.includes(i)) {
        unrevealedIndices.push(i);
      }
    }

    if (unrevealedIndices.length > 0) {
      const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
      setRevealedLetters([...revealedLetters, randomIndex]);
    }
  };
  
  const handleGuess = (e) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    if (userGuess.trim().toLowerCase() === correctDino.Name.toLowerCase()) {
      setGameState('won');
    } else {
      const newMistakeCount = mistakes + 1;
      setMistakes(newMistakeCount);
      setUserGuess(''); // Limpa o input
      
      if (newMistakeCount >= MAX_MISTAKES) {
        setGameState('lost');
      } else {
        revealRandomLetter();
      }
    }
  };
  
  const renderNamePlaceholder = () => {
    if (!correctDino) return null;
    return correctDino.Name.split('').map((char, index) => {
      if (char === ' ' || revealedLetters.includes(index)) {
        return <span key={index} className="text-3xl md:text-5xl font-mono mx-1 min-w-[20px]">{char}</span>;
      }
      return <span key={index} className="text-3xl md:text-5xl font-mono mx-1">_</span>;
    });
  };

  if (gameState === 'loading') {
    return <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white text-2xl animate-pulse">Procurando um dinossauro misterioso...</div>;
  }

  return (
    <>
      <EndGameModal 
        gameState={gameState}
        correctDinoName={correctDino?.Name}
        onPlayAgain={() => startGame(allDinos)}
      />

      <div className="min-h-screen bg-stone-900 flex flex-col items-center p-4">
        <Link to="/" className="absolute top-4 left-4 text-amber-500 hover:text-amber-300 transition-colors">&larr; Voltar</Link>
        
        <div className="w-full max-w-2xl mx-auto text-center mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Adivinhe o DINO!</h1>

          <div className="bg-stone-800 rounded-lg p-4 mb-6 shadow-2xl">
            <img src={dinoImage} alt="Dinossauro misterioso" className="max-h-80 mx-auto rounded-md" />
          </div>

          {/* Vidas (Emojis de Dinossauro) */}
          <div className="flex justify-center gap-3 mb-4">
            {Array(MAX_MISTAKES).fill(null).map((_, index) => (
              <span key={index} className={`text-4xl transition-all ${index < mistakes ? 'grayscale opacity-30' : ''}`}>🦖</span>
            ))}
          </div>
          
          <div className="min-h-[80px]"> {/* Placeholder do nome */}
            <div className="mb-6 tracking-widest flex justify-center flex-wrap items-center">
              {renderNamePlaceholder()}
            </div>
          </div>

          <form onSubmit={handleGuess} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input 
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              placeholder="Digite o nome..."
              disabled={gameState !== 'playing'}
              className="w-full sm:w-auto flex-grow px-4 py-3 bg-stone-700 border border-stone-600 rounded-full text-white text-center text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button 
              type="submit"
              disabled={gameState !== 'playing'}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all transform hover:scale-105 text-lg"
            >
              DESENTERREI!
            </button>
          </form>

          <div className="mt-8">
            {!showHelp ? (
              <button 
                onClick={() => setShowHelp(true)}
                disabled={gameState !== 'playing'}
                className="px-5 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Help
              </button>
            ) : (
              <div className="p-4 bg-stone-800/50 rounded-lg text-left max-w-lg mx-auto">
                <h3 className="font-bold text-amber-500 mb-2">Dica:</h3>
                <p className="text-stone-300">{correctDino?.Description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GuessDinoPage;