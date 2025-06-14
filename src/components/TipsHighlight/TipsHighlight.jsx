import React from 'react';
import { Link } from 'react-router-dom';
import './TipsHighlight.css';

const TipsHighlight = () => {
  return (
    <section className="tips-highlight">
      <div className="tips-highlight-container">
        <div className="tips-highlight-content">
          <div className="tips-highlight-text">
            <h2>Portal de Dicas Hannover</h2>
            <p className="tips-subtitle">
              Descubra tudo sobre calçados esportivos e encontre o produto ideal para cada atividade
            </p>
            <div className="tips-features">
              <div className="tip-feature">
                <div className="feature-icon">👟</div>
                <div className="feature-text">
                  <h4>Guia de Corrida</h4>
                  <p>Dicas para escolher o tênis ideal para sua pisada e tipo de corrida</p>
                </div>
              </div>
              <div className="tip-feature">
                <div className="feature-icon">⚽</div>
                <div className="feature-text">
                  <h4>Chuteiras Profissionais</h4>
                  <p>Como escolher a chuteira perfeita para cada tipo de campo</p>
                </div>
              </div>
              <div className="tip-feature">
                <div className="feature-icon">🏀</div>
                <div className="feature-text">
                  <h4>Basquete & Lifestyle</h4>
                  <p>Tênis para quadra e uso casual com máximo conforto</p>
                </div>
              </div>
            </div>
            <Link to="/tips-portal" className="tips-cta-button">
              Explorar Portal de Dicas
              <span className="button-arrow">→</span>
            </Link>
          </div>
          <div className="tips-highlight-visual">
            <div className="tips-cards">
              <div className="tip-card">
                <img 
                  src="https://images.unsplash.com/photo-1597892657493-6847b9640bac?w=300&h=200&fit=crop" 
                  alt="Tênis de corrida" 
                />
                <div className="tip-card-content">
                  <h5>Tipos de Pisada</h5>
                  <p>Neutra, pronada ou supinada?</p>
                </div>
              </div>
              <div className="tip-card">
                <img 
                  src="https://images.unsplash.com/photo-1620650663972-a03f6f55930a?w=300&h=200&fit=crop" 
                  alt="Chuteiras" 
                />
                <div className="tip-card-content">
                  <h5>Campo vs Sintético</h5>
                  <p>Escolha a trava certa</p>
                </div>
              </div>
              <div className="tip-card">
                <img 
                  src="https://images.unsplash.com/photo-1641188721482-d6da1d5b87bf?w=300&h=200&fit=crop" 
                  alt="Tênis casual" 
                />
                <div className="tip-card-content">
                  <h5>Conforto Diário</h5>
                  <p>Estilo e funcionalidade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TipsHighlight; 