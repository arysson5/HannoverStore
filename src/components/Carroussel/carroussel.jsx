import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./carroussel.css";
// Importando as imagens
import jordanImage from "../../assets/images/carrossel_jordan.jpg";
import corridaImage from "../../assets/images/carroussel2.jpg";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const images = [
    {
      src: jordanImage,
      alt: "Tenis Esportivo",
      title: "Tênis Esportivo",
      description: "Descubra nossa nova coleção de tênis",
      className: "jordan-slide"
    },
    {
      src: corridaImage,
      alt: "Corrida",
      title: "Equipamentos para Corrida",
      description: "Os melhores equipamentos para sua corrida",
      className: "corrida-slide"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === images.length - 1 ? 0 : current + 1
      );
    }, 10000); // Change slide every 5 seconds

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
