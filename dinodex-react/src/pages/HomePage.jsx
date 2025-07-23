import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DinoList from '../components/DinoList';
import DinoModal from '../components/DinoModal';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'https://dinosaur-facts-api.shultzlab.com/dinosaurs';

function HomePage() {
  const [allDinos, setAllDinos] = useState([]);
  const [filteredDinos, setFilteredDinos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDino, setSelectedDino] = useState(null);

  useEffect(() => {
    const fetchDinos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Erro de rede: ${response.statusText}`);
        }
        
        const data = await response.json();
        const sortedAndNumberedDinos = data
          .sort((a, b) => a.Name.localeCompare(b.Name))
          .map((dino, index) => ({
            ...dino,
            pokedexNumber: `#${String(index + 1).padStart(3, '0')}` 
          }));

        setAllDinos(sortedAndNumberedDinos);
        setFilteredDinos(sortedAndNumberedDinos);
      } catch (error) {
        console.error("ERRO DETALHADO AO BUSCAR:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDinos();
  }, []);

  useEffect(() => {
    let dinos = [...allDinos];
    if (searchTerm) {
      dinos = dinos.filter(dino => 
        dino.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredDinos(dinos);
  }, [searchTerm, allDinos]);

  const handleCardClick = (dino) => {
    setSelectedDino(dino);
  };

  return (
    <>
      <Header 
        searchTerm={searchTerm}
        onSearchChange={e => setSearchTerm(e.target.value)}
      />
      <main className="container mx-auto p-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DinoList dinos={filteredDinos} onCardClick={handleCardClick} />
        )}
      </main>
      <DinoModal dino={selectedDino} onClose={() => setSelectedDino(null)} />
    </>
  );
}

export default HomePage;