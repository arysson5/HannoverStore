import React, { useState } from 'react';

const Logo = ({ className = '', alt = 'Hannover Store' }) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('/Hanover logo bg.png');

  const handleError = () => {
    console.log('Erro ao carregar logo, tentando fallback...');
    if (!imageError) {
      setImageError(true);
      setCurrentSrc('/placeholder-product.jpg');
    }
  };

  return (
    <div className={`logo ${className}`}>
      <img 
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={() => console.log('Logo carregada com sucesso:', currentSrc)}
      />
    </div>
  );
};

export default Logo;
