import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Carroussel from "./components/Carroussel/carroussel.jsx";
import Card from "./components/Card/card.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  // Generate unique IDs for products
  const products = [
    {
      id: "chuteira-nike",
      title: "Chuteira Nike",
      image: "chuteira_nike.jpg",
      price: "R$ 199,99"
    },
    {
      id: "chuteira-adidas",
      title: "Chuteira Adidas",
      image: "chuteira adidas.jpg",
      price: "R$ 299,99"
    },
    {
      id: "chuteira-puma",
      title: "Chuteira Puma",
      image: "chuteira_puma.jpg",
      price: "R$ 399,99"
    },
    {
      id: "chuteira-umbro",
      title: "Chuteira Umbro",
      image: "chuteira_umbro.jpg",
      price: "R$ 499,99"
    }
  ];

  return (
    <>
      <Navbar />
      <Carroussel />
      <p id="pfutebol">Futebol Na Veia:</p>
      <div id="cards">
        {products.map(product => (
          <Card 
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

export default App;
