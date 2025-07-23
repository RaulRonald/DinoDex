import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="text-center py-10">
      <p className="text-2xl font-semibold text-stone-300 animate-pulse">
        Carregando dinossauros...
      </p>
    </div>
  );
};

export default LoadingSpinner;