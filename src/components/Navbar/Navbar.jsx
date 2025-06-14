import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
  const { 
    cart, 
    user, 
    isAuthenticated, 
    logout, 
    applyFilters,
    resetFilters
  } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Calcular quantidade de itens no carrinho
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      applyFilters({ search: searchTerm.trim() });
      navigate('/'); // Garantir que está na home para ver os resultados
    }
  };

  const handleShowAllProducts = () => {
    resetFilters();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <div className="d-flex align-items-center">
          <div className="logo">
            <img src="/Hanover logo bg.png" alt="Hannover Store" />
          </div>
          <Link to="/" className="navbar-brand">
            Hannover Store
          </Link>
        </div>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <form className="search-container mb-3 mb-lg-0" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Pesquisar produtos..." 
              id="search" 
              className="form-control" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Pesquisar">
              🔍
            </button>
          </form>
          
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            
            <li className="nav-item">
              <button 
                className="nav-link btn-link" 
                onClick={handleShowAllProducts}
              >
                Produtos
              </button>
            </li>
            
            <li className="nav-item">
              <Link to="/tips-portal" className="nav-link tips-portal-link" onClick={() => setIsMenuOpen(false)}>
                Portal de Dicas
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <span className="nav-link user-greeting">
                    Olá, {user?.name}
                  </span>
                </li>
                
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMenuOpen(false)}>
                      Admin
                    </Link>
                  </li>
                )}
                
                <li className="nav-item">
                  <button 
                    className="nav-link btn-link logout-btn" 
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link login-btn" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
            )}
            
            <li className="nav-item">
              <Link to="/cart" className="nav-link cart-icon-link" onClick={() => setIsMenuOpen(false)}>
                <div className="cart-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {cartItemsCount > 0 && <span className="cart-count">{cartItemsCount}</span>}
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
