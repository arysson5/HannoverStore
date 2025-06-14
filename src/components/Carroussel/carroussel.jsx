import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./carroussel.css";

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
      src: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Portal de Dicas",
      title: "Portal de Dicas Hannover",
      description: "Descubra como escolher o calçado ideal para cada atividade",
      className: "tips-portal-slide",
      isPortalSlide: true
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
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);

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

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="hannover-carousel">
      <div className="carousel-container">
        <div className="carousel-slides">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === activeIndex ? 'active' : ''} ${image.className}`}
              style={{ display: index === activeIndex ? 'block' : 'none' }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="carousel-image"
              />
              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h2>{image.title}</h2>
                  <p>{image.description}</p>
                  {image.isPortalSlide && (
                    <Link to="/tips-portal" className="portal-cta-btn">
                      💡 Explorar Portal de Dicas
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-nav carousel-prev"
          onClick={handlePrevClick}
          aria-label="Slide anterior"
        >
          &#8249;
        </button>
        
        <button
          className="carousel-nav carousel-next"
          onClick={handleNextClick}
          aria-label="Próximo slide"
        >
          &#8250;
        </button>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
