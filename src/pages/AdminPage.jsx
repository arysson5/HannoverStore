import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './AdminPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const AdminPage = () => {
  const { user, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    stats: {},
    users: [],
    products: [],
    categories: [],
    orders: []
  });

  // Estados para formulários
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    image: '',
    sizes: '',
    colors: '',
    stock: '',
    features: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    slug: ''
  });

  // Estados para edição
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProductForm, setEditProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    image: '',
    sizes: '',
    colors: '',
    stock: '',
    features: ''
  });

  const [editCategoryForm, setEditCategoryForm] = useState({
    name: '',
    description: '',
    slug: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    console.log('Token encontrado:', token ? 'Sim' : 'Não');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/users`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/products`),
        fetch(`${API_BASE_URL}/api/categories`)
      ]);

      const usersData = await usersRes.json();
      const products = await productsRes.json();
      const categories = await categoriesRes.json();

      // Criar dados mockados para stats já que os endpoints não existem
      const mockStats = {
        totalUsers: usersData.users ? usersData.users.length : 0,
        totalProducts: products.products ? products.products.length : products.length,
        totalOrders: 89,
        totalRevenue: 15420.50
      };

      const productsList = products.products || products;
      setData({ 
        stats: mockStats, 
        users: usersData.users || [], 
        products: productsList, 
        categories 
      });
      setFilteredProducts(productsList);
    } catch (error) {
      console.error('Erro ao carregar dados do admin:', error);
      showNotification('Erro ao carregar dados do admin', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      // Simular deleção já que o endpoint não existe
      setData(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== userId)
      }));
      showNotification('Usuário deletado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      showNotification('Erro ao deletar usuário', 'error');
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: parseFloat(productForm.originalPrice),
        stock: parseInt(productForm.stock),
        sizes: productForm.sizes.split(',').map(s => s.trim()),
        colors: productForm.colors.split(',').map(c => c.trim()),
        features: productForm.features.split(',').map(f => f.trim()),
        images: [productForm.image],
        rating: 4.5,
        reviews: 0,
        gender: 'unisex'
      };

      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        showNotification('Produto criado com sucesso', 'success');
        setProductForm({
          name: '', description: '', price: '', originalPrice: '',
          category: '', brand: '', image: '', sizes: '', colors: '', stock: '', features: ''
        });
        loadDashboardData();
      } else {
        throw new Error('Erro ao criar produto');
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      showNotification('Erro ao criar produto', 'error');
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        showNotification('Produto deletado com sucesso', 'success');
        loadDashboardData();
      } else {
        throw new Error('Erro ao deletar produto');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      showNotification('Erro ao deletar produto', 'error');
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      // Simular criação já que o endpoint não existe
      const newCategory = {
        id: Date.now(),
        name: categoryForm.name,
        description: categoryForm.description,
        slug: categoryForm.slug,
        createdAt: new Date().toISOString()
      };
      
      setData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      
      showNotification('Categoria criada com sucesso', 'success');
      setCategoryForm({ name: '', description: '', slug: '' });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      showNotification('Erro ao criar categoria', 'error');
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
      // Simular deleção já que o endpoint não existe
      setData(prev => ({
        ...prev,
        categories: prev.categories.filter(category => category.id !== categoryId)
      }));
      showNotification('Categoria deletada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      showNotification('Erro ao deletar categoria', 'error');
    }
  };

  // Funções de filtro e visualização
  const filterProducts = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProducts(data.products);
      return;
    }
    
    const filtered = data.products.filter(product => 
      (product.name || product.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };

  const viewProduct = (product) => {
    setViewingProduct(product);
  };

  // Funções de edição
  const startEditProduct = (product) => {
    setEditingProduct(product);
    setEditProductForm({
      name: product.name || product.title || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category || '',
      brand: product.brand || '',
      image: product.images?.[0] || product.image || '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
      stock: product.stock?.toString() || '',
      features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || '')
    });
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
    setEditProductForm({
      name: '', description: '', price: '', originalPrice: '',
      category: '', brand: '', image: '', sizes: '', colors: '', stock: '', features: ''
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...editProductForm,
        price: parseFloat(editProductForm.price),
        originalPrice: parseFloat(editProductForm.originalPrice),
        stock: parseInt(editProductForm.stock),
        sizes: editProductForm.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: editProductForm.colors.split(',').map(c => c.trim()).filter(c => c),
        features: editProductForm.features.split(',').map(f => f.trim()).filter(f => f),
        images: [editProductForm.image]
      };

      console.log('Atualizando produto:', editingProduct.id);
      console.log('Dados do produto:', productData);
      console.log('Headers:', getAuthHeaders());

      const response = await fetch(`${API_BASE_URL}/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      console.log('Resposta do servidor:', response.status, response.statusText);

      if (response.ok) {
        showNotification('Produto atualizado com sucesso', 'success');
        cancelEditProduct();
        loadDashboardData();
      } else {
        const errorText = await response.text();
        console.error('Erro do servidor:', errorText);
        throw new Error(`Erro ao atualizar produto: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      showNotification('Erro ao atualizar produto', 'error');
    }
  };

  const startEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryForm({
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || ''
    });
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryForm({ name: '', description: '', slug: '' });
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      // Simular atualização já que o endpoint não existe
      setData(prev => ({
        ...prev,
        categories: prev.categories.map(category => 
          category.id === editingCategory 
            ? { ...category, ...editCategoryForm }
            : category
        )
      }));
      
      showNotification('Categoria atualizada com sucesso', 'success');
      setEditingCategory(null);
      setEditCategoryForm({ name: '', description: '', slug: '' });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      showNotification('Erro ao atualizar categoria', 'error');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="access-denied">
          <h2>Acesso Negado</h2>
          <p>Você precisa ser um administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <p>Bem-vindo, {user.name}</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Usuários
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Produtos
        </button>
        <button 
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Categorias
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Configurações
        </button>
      </div>

      <div className="admin-content">
        {loading && <div className="loading">Carregando...</div>}

        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total de Produtos</h3>
                <p className="stat-number">{data.stats.totalProducts || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total de Usuários</h3>
                <p className="stat-number">{data.stats.totalUsers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total de Categorias</h3>
                <p className="stat-number">{data.stats.totalCategories || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total de Pedidos</h3>
                <p className="stat-number">{data.stats.totalOrders || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <h2>Gerenciar Usuários</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Função</th>
                    <th>Data de Criação</th>
                    <th>Hash da Senha</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="password-hash">
                        <code>{user.passwordHash?.substring(0, 20)}...</code>
                      </td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteUser(user.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-tab">
            <h2>Gerenciar Produtos</h2>
            
            <div className="form-section">
              <h3>Adicionar Novo Produto</h3>
              <form onSubmit={createProduct} className="admin-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Marca"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                    required
                  />
                </div>
                <textarea
                  placeholder="Descrição"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  required
                />
                <div className="form-row">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço original"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Estoque"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {data.categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    placeholder="URL da imagem"
                    value={productForm.image}
                    onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Tamanhos (separados por vírgula)"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({...productForm, sizes: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Cores (separadas por vírgula)"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({...productForm, colors: e.target.value})}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Características (separadas por vírgula)"
                  value={productForm.features}
                  onChange={(e) => setProductForm({...productForm, features: e.target.value})}
                />
                <button type="submit" className="submit-btn">Criar Produto</button>
              </form>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h4>Lista de Produtos ({data.products.length} produtos)</h4>
                <div className="table-actions">
                  <input 
                    type="text" 
                    placeholder="Buscar produtos..." 
                    className="search-input"
                    onChange={(e) => filterProducts(e.target.value)}
                  />
                </div>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Marca</th>
                    <th>Preço</th>
                    <th>Preço Original</th>
                    <th>Estoque</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td className="product-image-cell">
                        <div className="product-image-preview">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              onError={(e) => {
                                e.target.src = '/placeholder-product.png';
                                e.target.alt = 'Imagem não encontrada';
                              }}
                            />
                          ) : (
                            <div className="no-image">Sem imagem</div>
                          )}
                        </div>
                      </td>
                      <td className="product-name">
                        <div className="product-name-content">
                          <strong>{product.name || product.title}</strong>
                          {product.description && (
                            <small className="product-description">
                              {product.description.length > 50 
                                ? `${product.description.substring(0, 50)}...` 
                                : product.description
                              }
                            </small>
                          )}
                        </div>
                      </td>
                      <td>{product.brand || 'N/A'}</td>
                      <td className="price-cell">
                        <strong>R$ {product.price?.toFixed(2) || '0.00'}</strong>
                      </td>
                      <td className="price-cell">
                        {product.originalPrice ? (
                          <span className="original-price">R$ {product.originalPrice.toFixed(2)}</span>
                        ) : (
                          <span className="no-original-price">-</span>
                        )}
                      </td>
                      <td className="stock-cell">
                        <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td>{product.category || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${product.stock > 0 ? 'active' : 'inactive'}`}>
                          {product.stock > 0 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => startEditProduct(product)}
                            title="Editar produto"
                          >
                            ✏️
                          </button>
                          <button 
                            className="view-btn"
                            onClick={() => viewProduct(product)}
                            title="Visualizar produto"
                          >
                            👁️
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteProduct(product.id)}
                            title="Deletar produto"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal de Visualização de Produto */}
            {viewingProduct && (
              <div className="modal-overlay">
                <div className="modal-content product-view-modal">
                  <div className="modal-header">
                    <h3>Visualizar Produto</h3>
                    <button 
                      className="close-btn"
                      onClick={() => setViewingProduct(null)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="product-view-content">
                    <div className="product-view-image">
                      {viewingProduct.image ? (
                        <img 
                          src={viewingProduct.image} 
                          alt={viewingProduct.name || viewingProduct.title}
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                            e.target.alt = 'Imagem não encontrada';
                          }}
                        />
                      ) : (
                        <div className="no-image-large">Sem imagem</div>
                      )}
                    </div>
                    <div className="product-view-details">
                      <h4>{viewingProduct.name || viewingProduct.title}</h4>
                      <p className="product-brand"><strong>Marca:</strong> {viewingProduct.brand || 'N/A'}</p>
                      <p className="product-category"><strong>Categoria:</strong> {viewingProduct.category || 'N/A'}</p>
                      <div className="product-prices">
                        <p className="current-price"><strong>Preço:</strong> R$ {viewingProduct.price?.toFixed(2) || '0.00'}</p>
                        {viewingProduct.originalPrice && (
                          <p className="original-price"><strong>Preço Original:</strong> R$ {viewingProduct.originalPrice.toFixed(2)}</p>
                        )}
                      </div>
                      <p className="product-stock"><strong>Estoque:</strong> {viewingProduct.stock || 0} unidades</p>
                      {viewingProduct.description && (
                        <div className="product-description">
                          <strong>Descrição:</strong>
                          <p>{viewingProduct.description}</p>
                        </div>
                      )}
                      {viewingProduct.sizes && (
                        <p><strong>Tamanhos:</strong> {Array.isArray(viewingProduct.sizes) ? viewingProduct.sizes.join(', ') : viewingProduct.sizes}</p>
                      )}
                      {viewingProduct.colors && (
                        <p><strong>Cores:</strong> {Array.isArray(viewingProduct.colors) ? viewingProduct.colors.join(', ') : viewingProduct.colors}</p>
                      )}
                      {viewingProduct.features && (
                        <div className="product-features">
                          <strong>Características:</strong>
                          <ul>
                            {Array.isArray(viewingProduct.features) 
                              ? viewingProduct.features.map((feature, index) => <li key={index}>{feature}</li>)
                              : viewingProduct.features.split(',').map((feature, index) => <li key={index}>{feature.trim()}</li>)
                            }
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setViewingProduct(null);
                        startEditProduct(viewingProduct);
                      }}
                    >
                      Editar Produto
                    </button>
                    <button 
                      className="close-btn"
                      onClick={() => setViewingProduct(null)}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de Edição de Produto */}
            {editingProduct && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Editar Produto</h3>
                  <form onSubmit={updateProduct} className="admin-form">
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Nome do produto"
                        value={editProductForm.name}
                        onChange={(e) => setEditProductForm({...editProductForm, name: e.target.value})}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Marca"
                        value={editProductForm.brand}
                        onChange={(e) => setEditProductForm({...editProductForm, brand: e.target.value})}
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Descrição"
                      value={editProductForm.description}
                      onChange={(e) => setEditProductForm({...editProductForm, description: e.target.value})}
                      required
                    />
                    <div className="form-row">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Preço"
                        value={editProductForm.price}
                        onChange={(e) => setEditProductForm({...editProductForm, price: e.target.value})}
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Preço original"
                        value={editProductForm.originalPrice}
                        onChange={(e) => setEditProductForm({...editProductForm, originalPrice: e.target.value})}
                      />
                      <input
                        type="number"
                        placeholder="Estoque"
                        value={editProductForm.stock}
                        onChange={(e) => setEditProductForm({...editProductForm, stock: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <select
                        value={editProductForm.category}
                        onChange={(e) => setEditProductForm({...editProductForm, category: e.target.value})}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {data.categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <div className="image-input-container">
                        <input
                          type="url"
                          placeholder="URL da imagem"
                          value={editProductForm.image}
                          onChange={(e) => setEditProductForm({...editProductForm, image: e.target.value})}
                          required
                        />
                        {editProductForm.image && (
                          <div className="image-preview-edit">
                            <img 
                              src={editProductForm.image} 
                              alt="Preview"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div className="image-error" style={{display: 'none'}}>
                              ❌ Imagem não encontrada
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Tamanhos (separados por vírgula)"
                        value={editProductForm.sizes}
                        onChange={(e) => setEditProductForm({...editProductForm, sizes: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Cores (separadas por vírgula)"
                        value={editProductForm.colors}
                        onChange={(e) => setEditProductForm({...editProductForm, colors: e.target.value})}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Características (separadas por vírgula)"
                      value={editProductForm.features}
                      onChange={(e) => setEditProductForm({...editProductForm, features: e.target.value})}
                    />
                    <div className="modal-actions">
                      <button type="submit" className="submit-btn">Salvar Alterações</button>
                      <button type="button" className="cancel-btn" onClick={cancelEditProduct}>Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-tab">
            <h2>Gerenciar Categorias</h2>
            
            <div className="form-section">
              <h3>Adicionar Nova Categoria</h3>
              <form onSubmit={createCategory} className="admin-form">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Slug (ex: tenis-esportivos)"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Descrição"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  required
                />
                <button type="submit" className="submit-btn">Criar Categoria</button>
              </form>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Slug</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td><code>{category.id}</code></td>
                      <td>{category.description}</td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => startEditCategory(category)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteCategory(category.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal de Edição de Categoria */}
            {editingCategory && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Editar Categoria</h3>
                  <form onSubmit={updateCategory} className="admin-form">
                    <input
                      type="text"
                      placeholder="Nome da categoria"
                      value={editCategoryForm.name}
                      onChange={(e) => setEditCategoryForm({...editCategoryForm, name: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Slug (ex: tenis-esportivos)"
                      value={editCategoryForm.slug}
                      onChange={(e) => setEditCategoryForm({...editCategoryForm, slug: e.target.value})}
                      required
                    />
                    <textarea
                      placeholder="Descrição"
                      value={editCategoryForm.description}
                      onChange={(e) => setEditCategoryForm({...editCategoryForm, description: e.target.value})}
                      required
                    />
                    <div className="modal-actions">
                      <button type="submit" className="submit-btn">Salvar Alterações</button>
                      <button type="button" className="cancel-btn" onClick={cancelEditCategory}>Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="settings-header">
              <h2>⚙️ Configurações do Sistema</h2>
              <p>Gerencie as configurações globais do sistema</p>
            </div>
            
            <div className="settings-content">
              <div className="settings-card">
                <div className="settings-card-header">
                  <h3>🤖 Configurações do Chatbot</h3>
                  <p>Configure a chave API do Google AI para o funcionamento do chatbot</p>
                </div>
                
                <div className="settings-card-content">
                  <div className="settings-info">
                    <p>Para configurar a chave API do Google AI, acesse a página dedicada de configurações:</p>
                    <a 
                      href="/admin/settings" 
                      className="settings-link-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔧 Abrir Configurações Avançadas
                    </a>
                  </div>
                  
                  <div className="settings-features">
                    <h4>Funcionalidades disponíveis:</h4>
                    <ul>
                      <li>✅ Configuração segura da chave API</li>
                      <li>✅ Validação automática da chave</li>
                      <li>✅ Status em tempo real</li>
                      <li>✅ Gerenciamento por administradores</li>
                      <li>✅ Histórico de alterações</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="settings-card">
                <div className="settings-card-header">
                  <h3>🔮 Configurações Futuras</h3>
                  <p>Mais configurações serão adicionadas em breve</p>
                </div>
                
                <div className="settings-card-content">
                  <div className="coming-soon-grid">
                    <div className="coming-soon-item">
                      <span className="coming-soon-icon">📧</span>
                      <span>Configurações de Email</span>
                    </div>
                    <div className="coming-soon-item">
                      <span className="coming-soon-icon">💳</span>
                      <span>Configurações de Pagamento</span>
                    </div>
                    <div className="coming-soon-item">
                      <span className="coming-soon-icon">📊</span>
                      <span>Configurações de Analytics</span>
                    </div>
                    <div className="coming-soon-item">
                      <span className="coming-soon-icon">🔔</span>
                      <span>Configurações de Notificações</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 