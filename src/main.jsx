import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Card from "./components/Card/card.jsx";
import Carroussel from "./components/Carroussel/carroussel.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Topics from "./components/Topics/Topics.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Navbar />
    <Carroussel />
    <p id="pfutebol">Futebol Na Veia:</p>
    <div id="cards">
      <Card image="chuteira_nike.jpg" title="Chuteira Nike" price="R$ 199,99" />
      <Card
        image="chuteira adidas.jpg"
        title="Chuteira Adidas"
        price="R$ 299,99"
      />
      <Card image="chuteira_puma.jpg" title="Chuteira Puma" price="R$ 399,99" />
      <Card
        image="chuteira_umbro.jpg"
        title="Chuteira Umbro"
        price="R$ 499,99"
      />
    </div>
  </StrictMode>
);
