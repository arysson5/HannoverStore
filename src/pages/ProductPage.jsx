import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AddToCartAnimation from "../components/AddToCartAnimation/AddToCartAnimation";
import CartConfirmModal from "../components/CartConfirmModal/CartConfirmModal";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useApp();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animationProps, setAnimationProps] = useState(null);
  const buttonRef = useRef(null);
  
  // This is a simplified example. In a real app, you would fetch product data from an API
  // Here we're hard-coding the products matching the ones in App.jsx
  const products = [
    {
      id: "chuteira-nike",
      title: "Chuteira Nike",
      image: "chuteira_nike.jpg",
      price: "R$ 199,99",
      description: "Chuteira de alta performance para jogadores de futebol. Projetada para oferecer controle máximo da bola e conforto durante toda a partida."
    },
    {
      id: "chuteira-adidas",
      title: "Chuteira Adidas",
      image: "chuteira adidas.jpg",
      price: "R$ 299,99",
      description: "Chuteira profissional Adidas com tecnologia avançada para maior precisão nos passes e chutes. Ideal para jogadores que buscam velocidade."
    },
    {
      id: "chuteira-puma",
      title: "Chuteira Puma",
      image: "chuteira_puma.jpg",
      price: "R$ 399,99",
      description: "Chuteira Puma com design moderno e materiais premium. Oferece excelente aderência em campos diversos e durabilidade superior."
    },
    {
      id: "chuteira-umbro",
      title: "Chuteira Umbro",
      image: "chuteira_umbro.jpg",
      price: "R$ 499,99",
      description: "Chuteira Umbro de alto desempenho com tecnologia para amortecimento de impacto. Perfeita para jogadores que valorizam conforto e estilo."
    }
  ];
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-not-found">
          <h2>Produto não encontrado</h2>
          <Link to="/">Voltar para a página inicial</Link>
        </div>
        <Footer />
      </>
    );
  }
  
  const handleAddToCart = async () => {
    // Animação + adicionar via AppContext (cartService), que busca o produto na API
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const startPosition = {
        top: buttonRect.top + buttonRect.height / 2,
        left: buttonRect.left + buttonRect.width / 2
      };
      
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        const endPosition = {
          top: cartRect.top + cartRect.height / 2,
          left: cartRect.left + cartRect.width / 2
        };
        
        setAnimationProps({ startPosition, endPosition });
        setShowAnimation(true);
        
        await addToCart(product.id, 1);
      } else {
        await addToCart(product.id, 1);
      }
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, 1);
  };
  
  return (
    <>
      <Navbar />
      <div className="product-page-container">
        <div className="product-details">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">{product.price}</p>
            <p className="product-description">{product.description}</p>
            
            <div className="product-actions">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                ref={buttonRef}
              >
                Adicionar ao Carrinho
              </button>
              <Link to="/cart">
                <button 
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                >
                  Comprar Agora
                </button>
              </Link>
            </div>
            
            <div className="back-link">
              <Link to="/">Voltar para produtos</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {showAnimation && animationProps && (
        <AddToCartAnimation 
          product={product}
          startPosition={animationProps.startPosition}
          endPosition={animationProps.endPosition}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      
      {showModal && (
        <CartConfirmModal 
          product={product} 
          onClose={closeModal} 
        />
      )}
    </>
  );
};

export default ProductPage; 