import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <div className="logo">
          <img src="Hanover logo bg.png" alt="Hannover Store" />
        </div>
        <a className="navbar-brand" href="#">Hannover Store</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <input type="text" placeholder="Pesquisar" id="search"  className="form-control"
        img src="lupa.png"/>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Produtos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contato</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
