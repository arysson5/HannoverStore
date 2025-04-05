import "./Topics.css";
import React from "react";

const Topics = () => {  
    return (    
        <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#chuteiras">Esportes</a>
          </li>
          <li class="nav-item"><a class="nav-link" href="#">Homens</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Mulheres</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Crianças</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Marcas</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Outlet</a></li>
          <li class="nav-item">
            <a class="nav-link" href="#">Acessórios</a>
          </li>
        </ul>
      </div>
    );
};

export default Topics;