import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Carroussel from "./components/Carroussel/carroussel.jsx";
import Card from "./components/Card/card.jsx";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
