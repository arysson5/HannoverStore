import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  // Função helper para converter preço para número
  const parsePrice = (price) => {
    // Se for undefined ou null, retorna 0
    if (!price && price !== 0) {
      return 0;
    }
    
    // Se já for um número, retorna ele
    if (typeof price === 'number') {
      return price;
    }
    
    // Se for string, tenta fazer o parse
    if (typeof price === 'string') {
      // Remove espaços e caracteres especiais
      const cleanPrice = price.replace(/[^\d,.-]/g, '').replace(',', '.');
      const parsed = parseFloat(cleanPrice);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // Para qualquer outro tipo, retorna 0
    return 0;
  };

  // Função helper para formatar preço para exibição
  const formatPrice = (price) => {
    const numericPrice = parsePrice(price);
    return `R$ ${numericPrice.toFixed(2).replace(".", ",")}`;
  };

  // Calcular total do carrinho
  const cartTotal = cart.reduce((total, item) => {
    const numericPrice = parsePrice(item.price);
    return total + (numericPrice * item.quantity);
  }, 0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Verificar se há itens inválidos no carrinho e limpar se necessário
  useEffect(() => {
    const hasInvalidItems = cart.some(item => 
      !item.price || 
      (!item.title && !item.name) || 
      !item.id ||
      (typeof item.price !== 'number' && typeof item.price !== 'string')
    );
    
    if (hasInvalidItems) {
      console.warn('Itens inválidos encontrados no carrinho, limpando...');
      clearCart();
    }
  }, [cart, clearCart]);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-empty-container">
          <div className="cart-empty">
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione produtos ao seu carrinho para continuar.</p>
            <Link to="/">
              <button className="continue-shopping-btn">Continuar Comprando</button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1>Meu Carrinho</h1>
        
        <div className="cart-items">
          {!isMobile && (
            <div className="cart-header">
              <div className="cart-product">Produto</div>
              <div className="cart-price">Preço</div>
              <div className="cart-quantity">Quantidade</div>
              <div className="cart-total">Total</div>
              <div className="cart-actions">Ações</div>
            </div>
          )}
          
          {cart.map((item) => {
            const numericPrice = parsePrice(item.price);
            const itemTotal = numericPrice * item.quantity;
            
            return (
              <div className="cart-item" key={`${item.id}-${item.size || ''}-${item.color || ''}`}>
                <div className="cart-product">
                  <img src={item.image} alt={item.name || item.title} />
                  <div className="cart-product-info">
                    <h3>{item.name || item.title}</h3>
                    {item.size && <p>Tamanho: {item.size}</p>}
                    {item.color && <p>Cor: {item.color}</p>}
                    {isMobile && (
                      <div className="mobile-price">
                        <span className="price-label">Preço:</span>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {!isMobile && <div className="cart-price">{formatPrice(item.price)}</div>}
                
                <div className="cart-quantity">
                  <button 
                    className="quantity-btn" 
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size, item.color)}
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="quantity-btn" 
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size, item.color)}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-total">
                  {isMobile && <span className="total-label">Total:</span>}
                  <span>R$ {itemTotal.toFixed(2).replace(".", ",")}</span>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    aria-label="Remover item"
                  >
                    {isMobile ? 'X' : 'Remover'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="cart-summary">
          <button 
            className="clear-cart-btn" 
            onClick={clearCart}
            aria-label="Limpar carrinho"
          >
            Limpar Carrinho
          </button>
          
          <div className="cart-totals">
            <div className="cart-total-row">
              <span>Subtotal:</span>
              <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="cart-total-row">
              <span>Frete:</span>
              <span>R$ 0,00</span>
            </div>
            <div className="cart-total-row grand-total">
              <span>Total:</span>
              <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
          
          <div className="cart-buttons">
            <Link to="/">
              <button className="continue-shopping-btn">Continuar Comprando</button>
            </Link>
            <button className="checkout-btn">Finalizar Compra</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart; 