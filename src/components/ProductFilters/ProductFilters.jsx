import React, { useState, useEffect } from 'react';
import './ProductFilters.css';

const ProductFilters = ({ categories, filters, onFilterChange, onResetFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      page: 1,
      limit: 12,
    });
    onResetFilters();
  };

  // Marcas populares (você pode expandir esta lista)
  const popularBrands = [
    'Nike', 'Adidas', 'Puma', 'Vans', 'Jordan', 
    'Mizuno', 'Havaianas', 'Caterpillar', 'Democrata', 
    'Ferracini', 'Vizzano', 'Arezzo', 'Bibi'
  ];

  return (
    <div className="product-filters">
      <div className="filters-grid">
        {/* Categoria */}
        <div className="filter-group">
          <label className="filter-label">Categoria</label>
          <select
            className="filter-select"
            value={localFilters.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Marca */}
        <div className="filter-group">
          <label className="filter-label">Marca</label>
          <select
            className="filter-select"
            value={localFilters.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
          >
            <option value="">Todas as marcas</option>
            {popularBrands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Preço Mínimo */}
        <div className="filter-group">
          <label className="filter-label">Preço Mínimo</label>
          <input
            type="number"
            className="filter-input"
            placeholder="R$ 0,00"
            value={localFilters.minPrice}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        {/* Preço Máximo */}
        <div className="filter-group">
          <label className="filter-label">Preço Máximo</label>
          <input
            type="number"
            className="filter-input"
            placeholder="R$ 999,99"
            value={localFilters.maxPrice}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="filter-actions">
        <button 
          className="filter-button apply-button"
          onClick={handleApplyFilters}
        >
          Aplicar Filtros
        </button>
        
        <button 
          className="filter-button reset-button"
          onClick={handleReset}
        >
          Limpar Filtros
        </button>
      </div>

      {/* Filtros rápidos por categoria */}
      <div className="quick-filters">
        <span className="quick-filters-label">Filtros rápidos:</span>
        <div className="quick-filter-buttons">
          {categories.slice(0, 6).map(category => (
            <button
              key={category.id}
              className={`quick-filter-btn ${localFilters.category === category.id ? 'active' : ''}`}
              onClick={() => {
                const newFilters = { ...localFilters, category: category.id };
                setLocalFilters(newFilters);
                onFilterChange(newFilters);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters; 