import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { generateProductSlug } from "../../utils/productUtils";
import AddToCartAnimation from "../AddToCartAnimation/AddToCartAnimation";
import CartConfirmModal from "../CartConfirmModal/CartConfirmModal";
import Shoe3DModeler from "../Shoe3DModeler/Shoe3DModeler";
import "./card.css";

const Card = ({ 
  title, 
  image, 
  price, 
  originalPrice, 
  id, 
  brand, 
  rating, 
  reviews, 
  product 
}) => {
  const { addToCart, showNotification } = useApp();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);
  const [animationProps, setAnimationProps] = useState(null);
  const [addedProduct, setAddedProduct] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Detect if device is touch-enabled
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const productData = product || {
        id: id || title,
        name: title,
        image,
        price: typeof price === 'string' ? parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.')) : price,
        brand
      };
      
      setAddedProduct(productData);
      
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const startPosition = {
          top: buttonRect.top + buttonRect.height / 2,
          left: buttonRect.left + buttonRect.width / 2
        };
        
        const cartIcon = document.querySelector('.cart-icon') || document.querySelector('[data-cart-icon]');
        if (cartIcon) {
          const cartRect = cartIcon.getBoundingClientRect();
          const endPosition = {
            top: cartRect.top + cartRect.height / 2,
            left: cartRect.left + cartRect.width / 2
          };
          
          setAnimationProps({ startPosition, endPosition });
          setShowAnimation(true);
        }
        
        // Adicionar ao carrinho via API
        await addToCart(productData.id, 1);
        
      } else {
        await addToCart(productData.id, 1);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      showNotification('Erro ao adicionar produto ao carrinho', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const open3DModal = () => {
    setShow3DModal(true);
  };

  const close3DModal = () => {
    setShow3DModal(false);
  };

  const handleCardClick = (e) => {
    // If the click was on the button, don't navigate
    if (e.target === buttonRef.current || buttonRef.current.contains(e.target)) {
      return;
    }
  };

  const handle3DClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    open3DModal();
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  const hasDiscount = originalPrice && originalPrice > (typeof price === 'string' ? parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.')) : price);

  return (
    <>
      <div className="card-wrapper">
        <Link 
          to={`/produto/${generateProductSlug(title)}`} 
          className="card-link"
          onClick={handleCardClick}
        >
          <div 
            className="product-card" 
            id="card"
            ref={cardRef}
          >
            <div className="card-image-container">
              <img src={image} alt={title} className="card-image" />
              {hasDiscount && (
                <div className="discount-badge">
                  {Math.round(((originalPrice - (typeof price === 'string' ? parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.')) : price)) / originalPrice) * 100)}% OFF
                </div>
              )}
              {brand && (
                <div className="brand-badge">
                  {brand}
                </div>
              )}
            </div>
            
            <div className="card-content">
              <h3 className="product-title">{title}</h3>
              
              {rating && (
                <div className="rating-container">
                  <div className="stars">
                    {renderStars(rating)}
                  </div>
                  <span className="rating-text">
                    {rating} {reviews && `(${reviews})`}
                  </span>
                </div>
              )}
              
              <div className="price-container">
                {hasDiscount && (
                  <span className="original-price">{originalPrice}</span>
                )}
                <span className="current-price">{price}</span>
              </div>
              
              <div className="card-buttons">
                <button 
                  className={`add-to-cart-btn ${isTouchDevice ? 'touch-device' : ''} ${isLoading ? 'loading' : ''}`}
                  onClick={handleAddToCart}
                  ref={buttonRef}
                  disabled={isLoading}
                  aria-label="Adicionar ao Carrinho"
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Adicionando...
                    </>
                  ) : (
                    'Adicionar ao Carrinho'
                  )}
                </button>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Botão 3D posicionado sobre o card */}
        <button 
          className="try-3d-btn-overlay"
          onClick={handle3DClick}
          aria-label="Experimentar em 3D"
          title="Experimentar tênis em 3D"
        >
          👟 3D
        </button>
      </div>
      
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
      
      {show3DModal && (
        <Shoe3DModeler 
          product={product || { id, name: title, image, price, brand }} 
          onClose={close3DModal} 
        />
      )}
    </>
  );
};

export default Card;
