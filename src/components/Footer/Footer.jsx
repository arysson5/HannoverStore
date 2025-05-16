import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Hannover Store</h3>
            <p>Sua loja completa de calçados esportivos e casuais com as melhores marcas do mercado.</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Categorias</h3>
            <ul>
              <li><Link to="#">Esportes</Link></li>
              <li><Link to="#">Feminino</Link></li>
              <li><Link to="#">Masculino</Link></li>
              <li><Link to="#">Crianças</Link></li>
              <li><Link to="#">Marcas</Link></li>
              <li><Link to="#">Outlet</Link></li>
              <li><Link to="#">Acessórios</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Informações</h3>
            <ul>
              <li><Link to="/return-policy">Política de Devolução</Link></li>
              <li><Link to="/tips-portal">Portal de Dicas</Link></li>
              <li><Link to="#">Sobre Nós</Link></li>
              <li><Link to="#">Termos e Condições</Link></li>
              <li><Link to="#">Política de Privacidade</Link></li>
              <li><Link to="#">Pagamentos</Link></li>
              <li><Link to="#">Trabalhe Conosco</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contato</h3>
            <p><i className="fas fa-map-marker-alt"></i> Av. Exemplo, 1234 - Centro</p>
            <p><i className="fas fa-phone-alt"></i> (11) 1234-5678</p>
            <p><i className="fas fa-envelope"></i> contato@hannoverstore.com.br</p>
            
            <h4 className="mt-4">Horário de Atendimento</h4>
            <p>Segunda a Sexta: 9h às 18h<br />Sábado: 9h às 13h</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="payment-methods">
            <span>Formas de Pagamento:</span>
            <div className="payment-icons">
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-amex"></i>
              <i className="fab fa-pix"></i>
              <i className="fas fa-barcode"></i>
            </div>
          </div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} Hannover Store. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 