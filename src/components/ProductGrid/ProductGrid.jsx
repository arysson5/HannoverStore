import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../Card/card.jsx';
import ProductFilters from '../ProductFilters/ProductFilters.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx';
import { apiUtils } from '../../services/api';
import './ProductGrid.css';

const ProductGrid = () => {
  const {
    products,
    categories,
    productsLoading,
    productsError,
    filters,
    applyFilters,
    resetFilters,
    searchProducts,
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (searchTerm) => {
    searchProducts(searchTerm);
  };

  const handleFilterChange = (newFilters) => {
    applyFilters(newFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  // Agrupar produtos por categoria
  const productsByCategory = React.useMemo(() => {
    const grouped = {};
    
    // Filtrar produtos baseado nos filtros ativos
    let filteredProducts = products;
    
    if (filters.search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(product =>
        product.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }
    
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= parseFloat(filters.minPrice)
      );
    }
    
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Se há filtro de categoria específica, mostrar apenas essa categoria
    if (filters.category) {
      const category = categories.find(cat => cat.id === filters.category);
      if (category) {
        grouped[category.id] = {
          name: category.name,
          products: filteredProducts.filter(product => product.category === category.id)
        };
      }
    } else {
      // Agrupar por todas as categorias
      categories.forEach(category => {
        const categoryProducts = filteredProducts.filter(product => product.category === category.id);
        if (categoryProducts.length > 0) {
          grouped[category.id] = {
            name: category.name,
            products: categoryProducts
          };
        }
      });
    }
    
    return grouped;
  }, [products, categories, filters]);

  if (productsError) {
    return (
      <div className="product-grid-error">
        <div className="error-message">
          <h3>Erro ao carregar produtos</h3>
          <p>{productsError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      {/* Header com título e controles */}
      <div className="product-grid-header">
        <div className="header-content">
          <h2 className="section-title">
            {filters.category ? 
              categories.find(cat => cat.id === filters.category)?.name || 'Produtos' 
              : 'Nossos Produtos'
            }
          </h2>
          
          <div className="header-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="search-input"
                defaultValue={filters.search}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.target.value);
                  }
                }}
              />
              <button 
                className="search-button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  handleSearch(input.value);
                }}
              >
                🔍
              </button>
            </div>

            <button
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros {showFilters ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <ProductFilters
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        )}

        {/* Indicadores de filtros ativos */}
        {(filters.category || filters.brand || filters.search || filters.minPrice || filters.maxPrice) && (
          <div className="active-filters">
            <span className="active-filters-label">Filtros ativos:</span>
            
            {filters.search && (
              <span className="filter-tag">
                Busca: "{filters.search}"
                <button onClick={() => handleFilterChange({ search: '' })}>×</button>
              </span>
            )}
            
            {filters.category && (
              <span className="filter-tag">
                {categories.find(cat => cat.id === filters.category)?.name}
                <button onClick={() => handleFilterChange({ category: '' })}>×</button>
              </span>
            )}
            
            {filters.brand && (
              <span className="filter-tag">
                {filters.brand}
                <button onClick={() => handleFilterChange({ brand: '' })}>×</button>
              </span>
            )}
            
            {(filters.minPrice || filters.maxPrice) && (
              <span className="filter-tag">
                Preço: {filters.minPrice ? `R$ ${filters.minPrice}` : '0'} - {filters.maxPrice ? `R$ ${filters.maxPrice}` : '∞'}
                <button onClick={() => handleFilterChange({ minPrice: '', maxPrice: '' })}>×</button>
              </span>
            )}
            
            <button className="clear-all-filters" onClick={handleResetFilters}>
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {productsLoading && <LoadingSpinner />}

      {/* Produtos organizados por categoria */}
      {!productsLoading && (
        <div className="products-by-category">
          {Object.keys(productsByCategory).length > 0 ? (
            Object.entries(productsByCategory).map(([categoryId, categoryData]) => (
              <div key={categoryId} className="category-section">
                <div className="category-header">
                  <h3 className="category-title">{categoryData.name}</h3>
                  <span className="category-count">
                    {categoryData.products.length} produto{categoryData.products.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="category-products">
                  {categoryData.products.map(product => (
                    <Card
                      key={product.id}
                      id={product.id}
                      image={product.image}
                      title={product.name}
                      price={apiUtils.formatPrice(product.price)}
                      originalPrice={product.originalPrice ? apiUtils.formatPrice(product.originalPrice) : null}
                      brand={product.brand}
                      rating={product.rating}
                      reviews={product.reviews}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <div className="no-products-content">
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou fazer uma nova busca.</p>
                <button onClick={handleResetFilters} className="reset-button">
                  Ver todos os produtos
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid; 