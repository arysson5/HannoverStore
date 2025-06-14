import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { productService, categoryService, cartService, authService } from '../services/api';

// Estado inicial
const initialState = {
  // Produtos
  products: [],
  categories: [],
  currentProduct: null,
  productsLoading: false,
  productsError: null,
  
  // Filtros e busca
  filters: {
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    limit: 12,
  },
  
  // Carrinho
  cart: [],
  cartLoading: false,
  
  // Autenticação
  user: null,
  isAuthenticated: false,
  authLoading: false,
  
  // UI
  showCartModal: false,
  showAuthModal: false,
  notification: null,
};

// Actions
const ACTIONS = {
  // Produtos
  SET_PRODUCTS_LOADING: 'SET_PRODUCTS_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_PRODUCTS_ERROR: 'SET_PRODUCTS_ERROR',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  
  // Filtros
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  
  // Carrinho
  SET_CART: 'SET_CART',
  SET_CART_LOADING: 'SET_CART_LOADING',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  
  // Autenticação
  SET_AUTH_LOADING: 'SET_AUTH_LOADING',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  
  // UI
  SHOW_CART_MODAL: 'SHOW_CART_MODAL',
  HIDE_CART_MODAL: 'HIDE_CART_MODAL',
  SHOW_AUTH_MODAL: 'SHOW_AUTH_MODAL',
  HIDE_AUTH_MODAL: 'HIDE_AUTH_MODAL',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    // Produtos
    case ACTIONS.SET_PRODUCTS_LOADING:
      return { ...state, productsLoading: action.payload };
    
    case ACTIONS.SET_PRODUCTS:
      return { 
        ...state, 
        products: action.payload, 
        productsLoading: false, 
        productsError: null 
      };
    
    case ACTIONS.SET_PRODUCTS_ERROR:
      return { 
        ...state, 
        productsError: action.payload, 
        productsLoading: false 
      };
    
    case ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    
    case ACTIONS.SET_CURRENT_PRODUCT:
      return { ...state, currentProduct: action.payload };
    
    // Filtros
    case ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    
    case ACTIONS.RESET_FILTERS:
      return { 
        ...state, 
        filters: { ...initialState.filters } 
      };
    
    // Carrinho
    case ACTIONS.SET_CART:
      return { ...state, cart: action.payload };
    
    case ACTIONS.SET_CART_LOADING:
      return { ...state, cartLoading: action.payload };
    
    case ACTIONS.ADD_TO_CART:
      return { ...state, cart: action.payload };
    
    case ACTIONS.REMOVE_FROM_CART:
      return { ...state, cart: action.payload };
    
    case ACTIONS.UPDATE_CART_QUANTITY:
      return { ...state, cart: action.payload };
    
    case ACTIONS.CLEAR_CART:
      return { ...state, cart: [] };
    
    // Autenticação
    case ACTIONS.SET_AUTH_LOADING:
      return { ...state, authLoading: action.payload };
    
    case ACTIONS.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        authLoading: false 
      };
    
    case ACTIONS.LOGOUT:
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        authLoading: false 
      };
    
    // UI
    case ACTIONS.SHOW_CART_MODAL:
      return { ...state, showCartModal: true };
    
    case ACTIONS.HIDE_CART_MODAL:
      return { ...state, showCartModal: false };
    
    case ACTIONS.SHOW_AUTH_MODAL:
      return { ...state, showAuthModal: true };
    
    case ACTIONS.HIDE_AUTH_MODAL:
      return { ...state, showAuthModal: false };
    
    case ACTIONS.SET_NOTIFICATION:
      return { ...state, notification: action.payload };
    
    case ACTIONS.CLEAR_NOTIFICATION:
      return { ...state, notification: null };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Inicialização
  useEffect(() => {
    initializeApp();
  }, []);

  // Inicializar aplicação
  const initializeApp = async () => {
    try {
      // Carregar categorias
      await loadCategories();
      
      // Carregar produtos iniciais
      await loadProducts();
      
      // Carregar carrinho do localStorage
      loadCart();
      
      // Verificar autenticação
      checkAuth();
    } catch (error) {
      console.error('Erro ao inicializar aplicação:', error);
    }
  };

  // Verificar autenticação
  const checkAuth = () => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      dispatch({ type: ACTIONS.SET_USER, payload: user });
    }
  };

  // Carregar produtos
  const loadProducts = async (filters = {}) => {
    dispatch({ type: ACTIONS.SET_PRODUCTS_LOADING, payload: true });
    
    try {
      const response = await productService.getAll({
        ...state.filters,
        ...filters,
      });
      
      dispatch({ type: ACTIONS.SET_PRODUCTS, payload: response.products || response });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_PRODUCTS_ERROR, payload: error.message });
      showNotification('Erro ao carregar produtos', 'error');
    }
  };

  // Carregar categorias
  const loadCategories = async () => {
    try {
      const categories = await categoryService.getAll();
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // Carregar produto específico
  const loadProduct = async (id) => {
    try {
      const product = await productService.getById(id);
      dispatch({ type: ACTIONS.SET_CURRENT_PRODUCT, payload: product });
      return product;
    } catch (error) {
      showNotification('Produto não encontrado', 'error');
      throw error;
    }
  };

  // Buscar produtos
  const searchProducts = async (query) => {
    const filters = { ...state.filters, search: query, page: 1 };
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
    await loadProducts(filters);
  };

  // Aplicar filtros
  const applyFilters = async (newFilters) => {
    const filters = { ...state.filters, ...newFilters, page: 1 };
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
    await loadProducts(filters);
  };

  // Resetar filtros
  const resetFilters = async () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
    await loadProducts(initialState.filters);
  };

  // Carregar carrinho
  const loadCart = () => {
    const cart = cartService.getCart();
    dispatch({ type: ACTIONS.SET_CART, payload: cart });
  };

  // Adicionar ao carrinho
  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    dispatch({ type: ACTIONS.SET_CART_LOADING, payload: true });
    
    try {
      const cart = await cartService.addItem(productId, quantity, size, color);
      dispatch({ type: ACTIONS.ADD_TO_CART, payload: cart });
      showNotification('Produto adicionado ao carrinho!', 'success');
      return cart;
    } catch (error) {
      showNotification('Erro ao adicionar produto ao carrinho', 'error');
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_CART_LOADING, payload: false });
    }
  };

  // Remover do carrinho
  const removeFromCart = (productId, size = null, color = null) => {
    const cart = cartService.removeItem(productId, size, color);
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: cart });
    showNotification('Produto removido do carrinho', 'info');
  };

  // Atualizar quantidade no carrinho
  const updateCartQuantity = (productId, quantity, size = null, color = null) => {
    const cart = cartService.updateQuantity(productId, quantity, size, color);
    dispatch({ type: ACTIONS.UPDATE_CART_QUANTITY, payload: cart });
  };

  // Limpar carrinho
  const clearCart = () => {
    cartService.clearCart();
    dispatch({ type: ACTIONS.CLEAR_CART });
    showNotification('Carrinho limpo', 'info');
  };

  // Finalizar compra
  const checkout = async (shippingData) => {
    try {
      const order = await cartService.checkout(shippingData);
      dispatch({ type: ACTIONS.CLEAR_CART });
      showNotification('Pedido realizado com sucesso!', 'success');
      return order;
    } catch (error) {
      showNotification('Erro ao finalizar compra', 'error');
      throw error;
    }
  };

  // Login
  const login = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    dispatch({ type: ACTIONS.SET_USER, payload: user });
    showNotification(`Bem-vindo(a), ${user.name}!`, 'success');
    
    return { user, token };
  };

  // Registro
  const register = async (userData) => {
    dispatch({ type: ACTIONS.SET_AUTH_LOADING, payload: true });
    
    try {
      const response = await authService.register(userData);
      showNotification('Conta criada com sucesso!', 'success');
      return response;
    } catch (error) {
      showNotification('Erro ao criar conta', 'error');
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_AUTH_LOADING, payload: false });
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    dispatch({ type: ACTIONS.LOGOUT });
    showNotification('Logout realizado com sucesso', 'info');
  };

  // Mostrar notificação
  const showNotification = (message, type = 'info') => {
    dispatch({ 
      type: ACTIONS.SET_NOTIFICATION, 
      payload: { message, type, id: Date.now() } 
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
      dispatch({ type: ACTIONS.CLEAR_NOTIFICATION });
    }, 5000);
  };

  // Controles de modal
  const showCartModal = () => dispatch({ type: ACTIONS.SHOW_CART_MODAL });
  const hideCartModal = () => dispatch({ type: ACTIONS.HIDE_CART_MODAL });
  const showAuthModal = () => dispatch({ type: ACTIONS.SHOW_AUTH_MODAL });
  const hideAuthModal = () => dispatch({ type: ACTIONS.HIDE_AUTH_MODAL });

  // Valores do contexto
  const value = {
    // Estado
    ...state,
    
    // Ações de produtos
    loadProducts,
    loadProduct,
    searchProducts,
    applyFilters,
    resetFilters,
    
    // Ações de carrinho
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    checkout,
    
    // Ações de autenticação
    login,
    register,
    logout,
    
    // Ações de UI
    showCartModal,
    hideCartModal,
    showAuthModal,
    hideAuthModal,
    showNotification,
    
    // Utilitários
    cartTotal: cartService.getTotal(),
    cartItemsCount: cartService.getTotalItems(),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

export default AppContext; 