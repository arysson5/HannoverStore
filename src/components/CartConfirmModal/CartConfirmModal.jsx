import React from 'react';
import { useApp } from '../../context/AppContext';
import './CartConfirmModal.css';

const CartConfirmModal = ({ product, onClose }) => {
  const { showCartModal } = useApp();

  const goToCart = () => {
    showCartModal();
    onClose();
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price);
    }
    return price;
  };

  return (
    <div className="cart-confirm-overlay">
      <div className="cart-confirm-modal">
        <div className="cart-confirm-header">
          <h3>🎉 Produto adicionado ao carrinho!</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="cart-confirm-content">
          <div className="product-added">
            <img src={product.image} alt={product.name || product.title} />
            <div className="product-info">
              <h4>{product.name || product.title}</h4>
              <p className="product-price">{formatPrice(product.price)}</p>
              {product.brand && <p className="product-brand">{product.brand}</p>}
            </div>
          </div>
          <p className="confirm-message">
            Ótima escolha! Deseja finalizar a compra ou continuar explorando nossos produtos?
          </p>
        </div>
        <div className="cart-confirm-actions">
          <button className="continue-btn" onClick={onClose}>
            Continuar Comprando
          </button>
          <button className="go-to-cart-btn" onClick={goToCart}>
            Ver Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartConfirmModal; 