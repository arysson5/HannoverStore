import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./carroussel.css";
// Importando as imagens


const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const images = [
    {
      src: "https://images.unsplash.com/photo-1589091637606-cf39856ab82f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Tenis Esportivo",
      title: "Tênis Esportivo",
      description: "Descubra nossa nova coleção de tênis",
      className: "tenis-slide"
    },
    {
      src: "https://images.unsplash.com/photo-1601866656253-7179120e5e59?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Corrida",
      title: "Equipamentos para Corrida",
      description: "Os melhores equipamentos para sua corrida",
      className: "corrida-slide"
    },
    {
      src: "https://images.unsplash.com/photo-1506079906501-adbb5907b720?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Futebol",
      title: "As melhores chuteiras para o seu jogo",
      description: "Descubra as chuteiras que vão revolucionar o seu jogo",
      className: "futebol-slide"
    },
    {
      src:"https://images.unsplash.com/photo-1489647767089-3944a3baa54e?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Jordan Raro",
      title: "Tenis Exclusivos",
      description: "Os Tenis Mais Raros da Marca",
      className: "jordan-slide"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === images.length - 1 ? 0 : current + 1
      );
    }, 7000); // Alterar slide a cada 7 segundos

    return () => clearInterval(interval);
  }, []);

  const handlePrevClick = () => {
    setActiveIndex((current) => 
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const handleNextClick = () => {
    setActiveIndex((current) => 
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div
      id="carouselExample"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          >
            <img
              src={image.src}
              className="d-block w-100"
              alt={image.alt}
            />
            <div className="carousel-caption">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        onClick={handlePrevClick}
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        onClick={handleNextClick}
      >
        <span className="carousel-control-next-icon"></span>
      </button>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
