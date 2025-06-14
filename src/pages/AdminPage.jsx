import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './AdminPage.css';

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
  }, [user]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3002/api/admin/stats', { headers: getAuthHeaders() }),
        fetch('http://localhost:3002/api/admin/users', { headers: getAuthHeaders() }),
        fetch('http://localhost:3002/api/products'),
        fetch('http://localhost:3002/api/categories')
      ]);

      const stats = await statsRes.json();
      const users = await usersRes.json();
      const products = await productsRes.json();
      const categories = await categoriesRes.json();

      setData({ stats, users, products: products.products || products, categories });
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
      const response = await fetch(`http://localhost:3002/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        showNotification('Usuário deletado com sucesso', 'success');
        loadDashboardData();
      } else {
        throw new Error('Erro ao deletar usuário');
      }
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

      const response = await fetch('http://localhost:3002/api/admin/products', {
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
      const response = await fetch(`http://localhost:3002/api/admin/products/${productId}`, {
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
      const response = await fetch('http://localhost:3002/api/admin/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryForm)
      });

      if (response.ok) {
        showNotification('Categoria criada com sucesso', 'success');
        setCategoryForm({ name: '', description: '', slug: '' });
        loadDashboardData();
      } else {
        throw new Error('Erro ao criar categoria');
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      showNotification('Erro ao criar categoria', 'error');
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
      const response = await fetch(`http://localhost:3002/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        showNotification('Categoria deletada com sucesso', 'success');
        loadDashboardData();
      } else {
        throw new Error('Erro ao deletar categoria');
      }
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      showNotification('Erro ao deletar categoria', 'error');
    }
  };

  // Funções de edição
  const startEditProduct = (product) => {
    setEditingProduct(product.id);
    setEditProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category || '',
      brand: product.brand || '',
      image: product.images?.[0] || product.image || '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      stock: product.stock?.toString() || '',
      features: Array.isArray(product.features) ? product.features.join(', ') : ''
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

      const response = await fetch(`http://localhost:3002/api/admin/products/${editingProduct}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        showNotification('Produto atualizado com sucesso', 'success');
        cancelEditProduct();
        loadDashboardData();
      } else {
        throw new Error('Erro ao atualizar produto');
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
      const response = await fetch(`http://localhost:3002/api/admin/categories/${editingCategory}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editCategoryForm)
      });

      if (response.ok) {
        showNotification('Categoria atualizada com sucesso', 'success');
        cancelEditCategory();
        loadDashboardData();
      } else {
        throw new Error('Erro ao atualizar categoria');
      }
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
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Marca</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>R$ {product.price?.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => startEditProduct(product)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                      <input
                        type="url"
                        placeholder="URL da imagem"
                        value={editProductForm.image}
                        onChange={(e) => setEditProductForm({...editProductForm, image: e.target.value})}
                        required
                      />
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
      </div>
    </div>
  );
};

export default AdminPage; 