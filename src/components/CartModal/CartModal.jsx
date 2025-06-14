import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './CartModal.css';

const CartModal = () => {
  const { 
    showCartModal, 
    hideCartModal, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    cartTotal,
    cartItemsCount,
    showNotification,
    isAuthenticated,
    showAuthModal
  } = useApp();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!showCartModal) return null;

  const handleQuantityChange = (productId, newQuantity, size, color) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      updateCartQuantity(productId, newQuantity, size, color);
    }
  };

  const handleRemoveItem = (productId, size, color) => {
    removeFromCart(productId, size, color);
  };

  const handleClearCart = () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      clearCart();
      showNotification('Carrinho limpo', 'info');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showNotification('Faça login para finalizar a compra', 'warning');
      hideCartModal();
      showAuthModal();
      return;
    }

    if (cart.length === 0) {
      showNotification('Carrinho vazio', 'warning');
      return;
    }

    setIsCheckingOut(true);
    
    // Simular processo de checkout
    setTimeout(() => {
      showNotification('Redirecionando para pagamento...', 'info');
      setIsCheckingOut(false);
      hideCartModal();
      // Aqui você pode redirecionar para uma página de checkout real
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={hideCartModal}>
      <div className="modal-content cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Carrinho de Compras</h2>
          <button className="close-btn" onClick={hideCartModal}>×</button>
        </div>
        
        <div className="modal-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Seu carrinho está vazio</h3>
              <p>Adicione alguns produtos para começar suas compras!</p>
              <button className="continue-shopping-btn" onClick={hideCartModal}>
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size || ''}-${item.color || ''}-${index}`} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-brand">{item.brand}</p>
                      
                      {item.size && (
                        <span className="item-variant">Tamanho: {item.size}</span>
                      )}
                      {item.color && (
                        <span className="item-variant">Cor: {item.color}</span>
                      )}
                      
                      <div className="item-price">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size, item.color)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size, item.color)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                        title="Remover item"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Itens ({cartItemsCount}):</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Frete:</span>
                  <span className="free-shipping">Grátis</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="clear-cart-btn"
                  onClick={handleClearCart}
                >
                  Limpar Carrinho
                </button>
                
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <span className="loading-spinner"></span>
                      Processando...
                    </>
                  ) : (
                    'Finalizar Compra'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal; 