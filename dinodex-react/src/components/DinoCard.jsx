import React, { useState, useEffect } from 'react';

// A função de fallback continua a mesma
const generateHSLColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 60%, 30%)`;
};

const DinoCard = ({ dino, onCardClick }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // NOVO: Adicionamos um manipulador de erro para a imagem
  const handleImageError = () => {
    // Se a imagem da Wikipedia falhar ao carregar, desistimos dela
    // e usamos nosso fundo colorido como fallback.
    setImageUrl(null); 
  };

  useEffect(() => {
    const fetchImage = async () => {
      // --- MUDANÇA PRINCIPAL ---
      // Pegamos apenas a primeira palavra do nome para a busca.
      // "Tyrannosaurus Rex" vira "Tyrannosaurus"
      const queryName = dino.Name.split(' ')[0];
      
      const WIKIPEDIA_API_URL = `https://en.wikipedia.org/w/api.php?action=query&titles=${queryName}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
      
      try {
        const response = await fetch(WIKIPEDIA_API_URL);
        const data = await response.json();
        const pages = data.query.pages;
        const page = pages[Object.keys(pages)[0]];

        // Verifica se a página foi encontrada (pageid não é -1) e se tem uma imagem
        if (page.pageid && page.thumbnail && page.thumbnail.source) {
          setImageUrl(page.thumbnail.source);
        }
      } catch (error) {
        console.error(`Falha ao buscar imagem para ${dino.Name}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [dino.Name]);

  const color1 = generateHSLColor(dino.Name);
  const color2 = generateHSLColor(dino.Name.split("").reverse().join(""));
  const fallbackStyle = {
    background: `linear-gradient(135deg, ${color1}, ${color2})`,
  };

  return (
    <div 
      className="relative rounded-lg shadow-lg cursor-pointer group transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
      onClick={() => onCardClick(dino)}
    >
      {imageUrl ? (
        // NOVO: Adicionamos o `onError` à tag da imagem
        <img 
          src={imageUrl} 
          alt={dino.Name} 
          className="w-full h-40 object-cover" 
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-40 flex items-center justify-center" style={fallbackStyle}>
          {isLoading && <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h2 className="text-xl font-bold capitalize text-white text-center truncate drop-shadow-md">{dino.Name}</h2>
        <span className="absolute top-2 right-2 text-lg font-bold text-white/40 group-hover:text-white/80 transition-colors">
          {dino.pokedexNumber}
        </span>
      </div>
    </div>
  );
};

export default DinoCard;