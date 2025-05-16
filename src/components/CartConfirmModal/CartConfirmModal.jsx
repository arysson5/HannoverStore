import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartConfirmModal.css';

const CartConfirmModal = ({ product, onClose }) => {
  const navigate = useNavigate();

  const goToCart = () => {
    navigate('/cart');
    onClose();
  };

  return (
    <div className="cart-confirm-overlay">
      <div className="cart-confirm-modal">
        <div className="cart-confirm-header">
          <h3>Produto adicionado ao carrinho!</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="cart-confirm-content">
          <div className="product-added">
            <img src={product.image} alt={product.title} />
            <div className="product-info">
              <h4>{product.title}</h4>
              <p>{product.price}</p>
            </div>
          </div>
          <p className="confirm-message">Deseja ir para o carrinho ou continuar comprando?</p>
        </div>
        <div className="cart-confirm-actions">
          <button className="continue-btn" onClick={onClose}>
            Continuar Comprando
          </button>
          <button className="go-to-cart-btn" onClick={goToCart}>
            Ir para o Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartConfirmModal; 