import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, formatDate } from '../utils/productUtils';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { products, addToCart, showNotification, getProductBySlug } = useApp();
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProduct = getProductBySlug(productSlug);
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
    setLoading(false);
  }, [products, productSlug, getProductBySlug]);

  const handleAddToCart = () => {
    console.log('🛒 Tentando adicionar ao carrinho:', {
      product: product?.name,
      selectedSize,
      selectedColor,
      quantity
    });

    if (!product) {
      showNotification('Produto não encontrado', 'error');
      return;
    }

    // Se não há tamanhos definidos, não exigir seleção
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showNotification('Selecione um tamanho', 'error');
      return;
    }

    // Se não há cores definidas, não exigir seleção
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      showNotification('Selecione uma cor', 'error');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg',
      size: selectedSize || 'Único',
      color: selectedColor || 'Padrão',
      quantity: quantity,
      brand: product.brand || 'N/A'
    };

    console.log('🛒 Item do carrinho:', cartItem);
    
    try {
      addToCart(cartItem);
      showNotification(`${product.name} adicionado ao carrinho!`, 'success');
      console.log('✅ Produto adicionado ao carrinho com sucesso');
    } catch (error) {
      console.error('❌ Erro ao adicionar ao carrinho:', error);
      showNotification('Erro ao adicionar ao carrinho', 'error');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Produto não encontrado</h2>
        <p>O produto que você está procurando não existe.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Voltar para a loja
        </button>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <span onClick={() => navigate('/')}>Início</span>
          <span>/</span>
          <span onClick={() => navigate('/products')}>Produtos</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Galeria de imagens */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images[selectedImage] || product.images[0]} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
              {discountPercentage > 0 && (
                <div className="discount-badge">
                  -{discountPercentage}%
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Informações do produto */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-brand">{product.brand}</div>
            </div>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'filled' : ''}>
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-text">
                {product.rating} ({product.reviews} avaliações)
              </span>
            </div>

            <div className="product-price">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Seleção de tamanho */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection">
                <h3>Tamanho</h3>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seleção de cor */}
            {product.colors && product.colors.length > 0 && (
              <div className="color-selection">
                <h3>Cor</h3>
                <div className="color-options">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div className="quantity-selection">
              <h3>Quantidade</h3>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="stock-info">
                {product.stock > 0 ? `${product.stock} disponíveis` : 'Fora de estoque'}
              </span>
            </div>

            {/* Botões de ação */}
            <div className="product-actions">
              <button 
                className="btn-add-cart"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Adicionar ao Carrinho
              </button>
              <button 
                className="btn-buy-now"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Comprar Agora
              </button>
            </div>

            {/* Informações adicionais */}
            <div className="product-details">
              <h3>Especificações</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Categoria:</span>
                  <span className="spec-value">{product.category}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Marca:</span>
                  <span className="spec-value">{product.brand}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Gênero:</span>
                  <span className="spec-value">{product.gender || 'Unissex'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Estoque:</span>
                  <span className="spec-value">{product.stock} unidades</span>
                </div>
                {product.createdAt && (
                  <div className="spec-item">
                    <span className="spec-label">Adicionado em:</span>
                    <span className="spec-value">{formatDate(product.createdAt)}</span>
                  </div>
                )}
              </div>

              {product.features && product.features.length > 0 && (
                <div className="product-features">
                  <h3>Características</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
