import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isFirstAdd, setIsFirstAdd] = useState(true);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      
      // Se já tiver itens no localStorage, não é a primeira adição
      if (parsedCart.length > 0) {
        setIsFirstAdd(false);
      }
    }
    
    // Verifica se já mostrou o modal antes
    const hasShownModal = localStorage.getItem("hasShownCartModal");
    if (hasShownModal === "true") {
      setIsFirstAdd(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    
    // Update cart count and total
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    
    const total = cartItems.reduce(
      (total, item) => total + parseFloat(item.price.replace("R$ ", "").replace(",", ".")) * item.quantity,
      0
    );
    setCartTotal(total);
    
    // Se adicionou algum item, marca que não é mais a primeira adição
    if (cartItems.length > 0) {
      setIsFirstAdd(false);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    const isFirstAddition = isFirstAdd;
    
    if (isFirstAddition) {
      localStorage.setItem("hasShownCartModal", "true");
    }
    
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // If item exists, increase its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // If item doesn't exist, add it to the cart with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    return isFirstAddition;
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isFirstAdd,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 