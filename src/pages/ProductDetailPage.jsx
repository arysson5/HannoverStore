import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/productUtils';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
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
      brand: product.brand || 'Hannover Store'
    };

    console.log('🛒 Item do carrinho criado:', cartItem);

    addToCart(cartItem);
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/carrinho');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-detail-loading">
          <div className="loading-spinner"></div>
          <p>Carregando produto...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-detail-error">
          <h2>Produto não encontrado</h2>
          <p>O produto que você está procurando não existe.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Voltar para a loja
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <div className="product-detail">
        <div className="product-detail-container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <span onClick={() => navigate('/')}>Início</span>
            <span>/</span>
            <span onClick={() => navigate('/products')}>Produtos</span>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-detail-content">
            {/* Galeria de imagens */}
            <div className="product-images">
              <div className="main-image">
                <img 
                  src={product.images && product.images[selectedImage] ? product.images[selectedImage] : '/placeholder-product.jpg'} 
                  alt={product.name}
                />
                {discountPercentage > 0 && (
                  <div className="discount-badge">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="image-thumbnails">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={selectedImage === index ? 'active' : ''}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Informações do produto */}
            <div className="product-info">
              <div className="product-header">
                <h1>{product.name}</h1>
                {product.brand && (
                  <p className="product-brand">Marca: {product.brand}</p>
                )}
              </div>

              <div className="product-rating">
                {product.rating && (
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < product.rating ? 'star filled' : 'star'}>
                        ★
                      </span>
                    ))}
                    <span className="rating-text">
                      {product.rating} {product.reviews && `(${product.reviews} avaliações)`}
                    </span>
                  </div>
                )}
              </div>

              <div className="product-price">
                {product.originalPrice && (
                  <span className="original-price">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="current-price">
                  {formatPrice(product.price)}
                </span>
                {discountPercentage > 0 && (
                  <span className="discount-text">
                    Economize {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              <div className="product-description">
                <p>{product.description || 'Descrição não disponível.'}</p>
              </div>

              {/* Opções de tamanho */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="product-options">
                  <h3>Tamanho</h3>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Opções de cor */}
              {product.colors && product.colors.length > 0 && (
                <div className="product-options">
                  <h3>Cor</h3>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
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

              {/* Controle de quantidade */}
              <div className="product-quantity">
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
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="product-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  Adicionar ao Carrinho
                </button>
                <button 
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                >
                  Comprar Agora
                </button>
              </div>

              {/* Informações adicionais */}
              <div className="product-details">
                <div className="detail-item">
                  <strong>SKU:</strong> {product.id}
                </div>
                {product.category && (
                  <div className="detail-item">
                    <strong>Categoria:</strong> {product.category}
                  </div>
                )}
                {product.stock && (
                  <div className="detail-item">
                    <strong>Estoque:</strong> {product.stock} unidades
                  </div>
                )}
              </div>

              {/* Características */}
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
      <Footer />
    </>
  );
};

export default ProductDetailPage;