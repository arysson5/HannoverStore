import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './CartPage.css';

const CartPage = ({ navigateTo }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    cartTotal,
    cartItemsCount,
    showNotification,
    isAuthenticated,
    user
  } = useApp();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
      navigateTo('login');
      return;
    }

    if (cart.length === 0) {
      showNotification('Carrinho vazio', 'warning');
      return;
    }

    setIsCheckingOut(true);
    
    // Simular processo de checkout
    setTimeout(() => {
      showNotification('Pedido realizado com sucesso!', 'success');
      clearCart();
      setIsCheckingOut(false);
      navigateTo('home');
    }, 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const calculateShipping = () => {
    return cartTotal >= 200 ? 0 : 15.90;
  };

  const shipping = calculateShipping();
  const finalTotal = cartTotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button 
          className="back-btn"
          onClick={() => navigateTo('home')}
        >
          ← Voltar às Compras
        </button>
        <h1>Carrinho de Compras</h1>
        {cart.length > 0 && (
          <button 
            className="clear-all-btn"
            onClick={handleClearCart}
          >
            Limpar Tudo
          </button>
        )}
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Seu carrinho está vazio</h2>
            <p>Que tal adicionar alguns produtos incríveis?</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigateTo('home')}
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              <h2>Itens no Carrinho ({cartItemsCount})</h2>
              
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size || ''}-${item.color || ''}-${index}`} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-brand">{item.brand}</p>
                      
                      <div className="item-variants">
                        {item.size && (
                          <span className="item-variant">Tamanho: {item.size}</span>
                        )}
                        {item.color && (
                          <span className="item-variant">Cor: {item.color}</span>
                        )}
                      </div>
                      
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
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="cart-summary">
                <h3>Resumo do Pedido</h3>
                
                <div className="summary-row">
                  <span>Subtotal ({cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}):</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Frete:</span>
                  <span className={shipping === 0 ? 'free-shipping' : ''}>
                    {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <div className="shipping-info">
                    <small>
                      Frete grátis para compras acima de {formatPrice(200)}
                    </small>
                  </div>
                )}
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
                
                {isAuthenticated && (
                  <div className="user-info">
                    <p>Entregar para: <strong>{user?.name}</strong></p>
                    <p>Email: {user?.email}</p>
                  </div>
                )}
                
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <span className="loading-spinner"></span>
                      Processando Pedido...
                    </>
                  ) : (
                    `Finalizar Compra - ${formatPrice(finalTotal)}`
                  )}
                </button>
                
                {!isAuthenticated && (
                  <div className="login-prompt">
                    <p>
                      <button 
                        className="login-link"
                        onClick={() => navigateTo('login')}
                      >
                        Faça login
                      </button> 
                      para finalizar sua compra
                    </p>
                  </div>
                )}
                
                <div className="security-info">
                  <p>🔒 Compra 100% segura e protegida</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 