import React, { useState, useEffect } from 'react';

const DinoModal = ({ dino, onClose }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const handleImageError = () => {
    setImageUrl(null);
  };

  useEffect(() => {
    setImageUrl(null);
    setIsLoadingImage(true);

    if (dino) {
      const fetchImage = async () => {
        // Usando a mesma lógica de buscar apenas pelo primeiro nome
        const queryName = dino.Name.split(' ')[0];
        const WIKIPEDIA_API_URL = `https://en.wikipedia.org/w/api.php?action=query&titles=${queryName}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
        try {
          const response = await fetch(WIKIPEDIA_API_URL);
          const data = await response.json();
          const pages = data.query.pages;
          const page = pages[Object.keys(pages)[0]];
          if (page.pageid && page.thumbnail && page.thumbnail.source) {
            setImageUrl(page.thumbnail.source);
          }
        } catch (error) {
          console.error(`Falha ao buscar imagem para o modal de ${dino.Name}:`, error);
        } finally {
          setIsLoadingImage(false);
        }
      };
      fetchImage();
    }
  }, [dino]);

  if (!dino) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-20" onClick={onClose}>
      <div className="bg-stone-900 border-2 border-stone-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-4 text-stone-400 hover:text-amber-500 text-4xl font-bold transition-colors z-30">&times;</button>
        
        <div className="p-8 flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 flex-shrink-0 text-center">
                <div className="w-full h-64 bg-stone-800 rounded-lg flex items-center justify-center border-2 border-stone-700">
                    {isLoadingImage ? (
                        <div className="w-8 h-8 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
                    ) : imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={dino.Name} 
                          className="w-full h-full object-cover rounded-lg" 
                          onError={handleImageError}
                        />
                    ) : (
                        <p className="text-stone-500">Imagem não encontrada</p>
                    )}
                </div>
            </div>
            <div className="lg:w-2/3">
                <span className="text-xl font-bold text-white/50">{dino.pokedexNumber}</span>
                <h2 className="text-5xl font-bold capitalize mt-1 text-amber-500">{dino.Name}</h2>
                <div className="mt-6">
                    <h3 className="text-2xl font-bold mb-2 text-stone-300">Descrição</h3>
                    <p className="text-stone-300 text-lg leading-relaxed">{dino.Description}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DinoModal;