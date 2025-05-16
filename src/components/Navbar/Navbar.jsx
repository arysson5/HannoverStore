import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <div className="logo">
          <img src="Hanover logo bg.png" alt="Hannover Store" />
        </div>
        <Link className="navbar-brand" to="/">Hannover Store</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <input type="text" placeholder="Pesquisar" id="search" className="form-control" />
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Produtos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Contato</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link login-btn" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link register-btn" to="/register">Registrar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link cart-icon-link" to="/cart">
                <div className="cart-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
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
