import React from 'react';
import DinoCard from './DinoCard';

const DinoList = ({ dinos, onCardClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {dinos.map(dino => (
        // ATUALIZAÇÃO: Usando dino.Name como chave
        <DinoCard key={dino.Name} dino={dino} onCardClick={onCardClick} />
      ))}
    </div>
  );
};

export default DinoList;