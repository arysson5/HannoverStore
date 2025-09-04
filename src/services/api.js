const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const API_URL = `${API_BASE_URL}/api`;

// Função auxiliar para fazer requisições HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Adicionar token de autenticação se existir
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Serviços de Autenticação
export const authService = {
  // Registrar usuário
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obter perfil do usuário
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  // Verificar se está logado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Serviços de Produtos
export const productService = {
  // Listar todos os produtos com filtros
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return apiRequest(endpoint);
  },

  // Obter produto por ID
  getById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Criar produto (admin)
  create: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Atualizar produto (admin)
  update: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Atualizar parcialmente produto (admin)
  patch: async (id, updates) => {
    return apiRequest(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Deletar produto (admin)
  delete: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Buscar produtos
  search: async (query, filters = {}) => {
    return productService.getAll({ search: query, ...filters });
  },
};

// Serviços de Categorias
export const categoryService = {
  // Listar todas as categorias
  getAll: async () => {
    return apiRequest('/categories');
  },

  // Obter categoria por ID
  getById: async (id) => {
    return apiRequest(`/categories/${id}`);
  },

  // Buscar categorias
  search: async (query) => {
    return apiRequest(`/categories/search?q=${encodeURIComponent(query)}`);
  },
};

// Serviços de Pedidos
export const orderService = {
  // Criar pedido
  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Listar pedidos do usuário
  getUserOrders: async () => {
    return apiRequest('/orders');
  },

  // Obter pedido por ID
  getById: async (id) => {
    return apiRequest(`/orders/${id}`);
  },
};

// Serviço de carrinho (local storage + API)
export const cartService = {
  // Obter carrinho do localStorage
  getCart: () => {
    const cart = localStorage.getItem('cart');
    if (!cart) return [];
    
    try {
      const parsedCart = JSON.parse(cart);
      // Filtrar itens inválidos
      return parsedCart.filter(item => 
        item && 
        item.id && 
        item.name && 
        item.price !== undefined && 
        item.price !== null &&
        item.quantity > 0
      );
    } catch (error) {
      console.error('Erro ao parsear carrinho do localStorage:', error);
      localStorage.removeItem('cart');
      return [];
    }
  },

  // Salvar carrinho no localStorage
  saveCart: (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  // Adicionar item ao carrinho
  addItem: async (productId, quantity = 1, size = null, color = null) => {
    try {
      // Buscar dados do produto na API
      const product = await productService.getById(productId);
      
      const cart = cartService.getCart();
      const existingItemIndex = cart.findIndex(
        item => item.id === productId && item.size === size && item.color === color
      );

      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : product.image,
          quantity,
          size,
          color,
          brand: product.brand,
        });
      }

      cartService.saveCart(cart);
      return cart;
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      throw error;
    }
  },

  // Adicionar item com dados completos (da página de produto)
  addItemWithData: (itemData) => {
    try {
      const cart = cartService.getCart();
      const existingItemIndex = cart.findIndex(
        item => item.id === itemData.id && item.size === itemData.size && item.color === itemData.color
      );

      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += itemData.quantity;
      } else {
        cart.push({
          id: itemData.id,
          name: itemData.name,
          price: itemData.price,
          image: itemData.image,
          quantity: itemData.quantity,
          size: itemData.size,
          color: itemData.color,
          brand: itemData.brand || 'N/A',
        });
      }

      cartService.saveCart(cart);
      return cart;
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      throw error;
    }
  },

  // Remover item do carrinho
  removeItem: (productId, size = null, color = null) => {
    const cart = cartService.getCart();
    const filteredCart = cart.filter(
      item => !(item.id === productId && item.size === size && item.color === color)
    );
    cartService.saveCart(filteredCart);
    return filteredCart;
  },

  // Atualizar quantidade do item
  updateQuantity: (productId, quantity, size = null, color = null) => {
    const cart = cartService.getCart();
    const itemIndex = cart.findIndex(
      item => item.id === productId && item.size === size && item.color === color
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }

    cartService.saveCart(cart);
    return cart;
  },

  // Limpar carrinho
  clearCart: () => {
    localStorage.removeItem('cart');
    return [];
  },

  // Obter total do carrinho
  getTotal: () => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // Obter quantidade total de itens
  getTotalItems: () => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Finalizar compra
  checkout: async (shippingData) => {
    const cart = cartService.getCart();
    
    if (cart.length === 0) {
      throw new Error('Carrinho vazio');
    }

    const orderData = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
      })),
      shipping: shippingData,
      total: cartService.getTotal(),
    };

    try {
      const order = await orderService.create(orderData);
      cartService.clearCart();
      return order;
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      throw error;
    }
  },
};

// Utilitários
export const apiUtils = {
  // Formatar preço
  formatPrice: (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  },

  // Verificar se a API está online
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};

export default {
  auth: authService,
  products: productService,
  categories: categoryService,
  orders: orderService,
  cart: cartService,
  utils: apiUtils,
}; 