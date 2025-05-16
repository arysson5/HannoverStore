import React, { useEffect, useState } from 'react';
import './AddToCartAnimation.css';

const AddToCartAnimation = ({ product, startPosition, endPosition, onAnimationComplete }) => {
  const [style, setStyle] = useState({
    top: startPosition.top,
    left: startPosition.left,
    opacity: 1,
    transform: 'scale(1)',
    position: 'fixed',
    zIndex: 9999,
    transition: 'none',
  });

  useEffect(() => {
    // Força um reflow para que a transição funcione
    setTimeout(() => {
      setStyle({
        top: endPosition.top,
        left: endPosition.left,
        opacity: 0,
        transform: 'scale(0.3)',
        position: 'fixed',
        zIndex: 9999,
        transition: 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
      });
    }, 50);

    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 850);

    return () => clearTimeout(timer);
  }, [endPosition, onAnimationComplete, startPosition.left, startPosition.top]);

  return (
    <div className="cart-animation-wrapper" style={style}>
      <div className="cart-animation-item">
        <img src={product.image} alt={product.title} />
      </div>
    </div>
  );
};

export default AddToCartAnimation; 