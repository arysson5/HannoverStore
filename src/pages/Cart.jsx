import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Cart.css";

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cartItems.length === 0) {
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
          <div className="cart-header">
            <div className="cart-product">Produto</div>
            <div className="cart-price">Preço</div>
            <div className="cart-quantity">Quantidade</div>
            <div className="cart-total">Total</div>
            <div className="cart-actions">Ações</div>
          </div>
          
          {cartItems.map((item) => {
            // Extract numeric price
            const numericPrice = parseFloat(item.price.replace("R$ ", "").replace(",", "."));
            const itemTotal = numericPrice * item.quantity;
            
            return (
              <div className="cart-item" key={item.id}>
                <div className="cart-product">
                  <img src={item.image} alt={item.title} />
                  <div className="cart-product-info">
                    <h3>{item.title}</h3>
                  </div>
                </div>
                
                <div className="cart-price">{item.price}</div>
                
                <div className="cart-quantity">
                  <button 
                    className="quantity-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="quantity-btn" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-total">
                  R$ {itemTotal.toFixed(2).replace(".", ",")}
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="cart-summary">
          <button className="clear-cart-btn" onClick={clearCart}>
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