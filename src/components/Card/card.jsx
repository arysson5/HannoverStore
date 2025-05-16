import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import AddToCartAnimation from "../AddToCartAnimation/AddToCartAnimation";
import CartConfirmModal from "../CartConfirmModal/CartConfirmModal";
import "./card.css";

const Card = ({ title, image, price, id }) => {
  const { addToCart } = useCart();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animationProps, setAnimationProps] = useState(null);
  const [addedProduct, setAddedProduct] = useState(null);
  const buttonRef = useRef(null);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to product page when clicking the button
    
    // Preparando as informações do produto
    const product = {
      id: id || title,
      title,
      image,
      price
    };
    setAddedProduct(product);
    
    // Obtendo as posições para a animação
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const startPosition = {
        top: buttonRect.top + buttonRect.height / 2,
        left: buttonRect.left + buttonRect.width / 2
      };
      
      // Buscar o elemento do carrinho no DOM para definir o destino
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        const endPosition = {
          top: cartRect.top + cartRect.height / 2,
          left: cartRect.left + cartRect.width / 2
        };
        
        setAnimationProps({ startPosition, endPosition });
        setShowAnimation(true);
        
        // Adicionar ao carrinho e verificar se é a primeira adição
        const isFirstAddition = addToCart(product);
        
        // Se for a primeira adição, vai mostrar o modal após a animação
        if (isFirstAddition) {
          // O modal será exibido quando a animação terminar
        }
      } else {
        // Se não encontrar o ícone do carrinho, apenas adiciona ao carrinho
        addToCart(product);
      }
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    
    // Verificar novamente se é a primeira adição
    // O localStorage já deve ter sido atualizado pelo addToCart
    const hasShownModal = localStorage.getItem("hasShownCartModal");
    const isFirstTimeShown = hasShownModal === "true" && !localStorage.getItem("modalAlreadyShown");
    
    if (isFirstTimeShown) {
      setShowModal(true);
      localStorage.setItem("modalAlreadyShown", "true");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Link to={`/product/${id}`} className="card-link">
        <div className="border rounded-lg shadow-md p-4" id="card">
          <img src={image} alt={title} />
          <h2 className="text-lg font-semibold mt-2">{title}</h2>
          <p className="text-gray-700">{price}</p>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            onClick={handleAddToCart}
            ref={buttonRef}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </Link>
      
      {showAnimation && animationProps && addedProduct && (
        <AddToCartAnimation 
          product={addedProduct}
          startPosition={animationProps.startPosition}
          endPosition={animationProps.endPosition}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      
      {showModal && addedProduct && (
        <CartConfirmModal 
          product={addedProduct} 
          onClose={closeModal} 
        />
      )}
    </>
  );
};

export default Card;
