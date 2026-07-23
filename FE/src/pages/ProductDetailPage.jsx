import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    async function loadProductDetails() {
      try {
        const data = await api.getProductById(id);
        if (isMounted && data) {
          setProduct({
            id: data.id,
            name: data.name,
            description: data.description || 'No description provided.',
            price: Number(data.price || 0),
            stock: Number(data.stockQty),
            image: data.imageUrl || '',
            category: data.categoryName || '',
            brand: data.brandName || '',
          });
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Product not found or currently unavailable.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProductDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-sm md:px-gutter py-xl">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-surface-container-high rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-surface-container-high rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-surface-container-high rounded w-3/4"></div>
              <div className="h-6 bg-surface-container-high rounded w-1/2"></div>
              <div className="h-24 bg-surface-container-high rounded"></div>
              <div className="h-12 bg-surface-container-high rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-container-max mx-auto px-sm md:px-gutter py-xl text-center">
        <div className="bg-white border border-outline-variant/30 rounded-2xl p-xl shadow-sm max-w-lg mx-auto">
          <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
          <h2 className="text-headline-md font-bold text-on-surface mb-2">Product Not Found</h2>
          <p className="text-body-md text-on-surface-variant mb-6">{error || "The product you are looking for does not exist."}</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-label-md rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-sm md:px-gutter py-md">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-label-md text-on-surface-variant mb-6 font-semibold">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-base">home</span> Home
        </Link>
        <span className="text-outline">/</span>
        <Link to="/" className="hover:text-primary transition-colors">Catalog</Link>
        <span className="text-outline">/</span>
        <span className="text-on-surface line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-md md:p-lg shadow-sm">
        
        {/* Product Media Column */}
        <div className="col-span-12 lg:col-span-6 flex flex-col items-center">
          <div className="w-full h-80 md:h-[450px] bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 flex items-center justify-center relative group">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <span className="material-symbols-outlined text-6xl text-outline" aria-label="No product image">
                image_not_supported
              </span>
            )}
            <span className="absolute top-4 left-4 bg-secondary text-on-secondary font-label-sm px-3 py-1 rounded-full shadow-sm font-bold">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Information Column */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-label-sm font-bold uppercase tracking-wider text-secondary bg-secondary-container px-2.5 py-1 rounded">
                Brand: {product.brand}
              </span>
              <span className="text-label-sm text-outline font-medium">Product #{product.id}</span>
            </div>

            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold leading-snug mb-3">
              {product.name}
            </h1>

            {/* Price Display */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 mb-6 flex items-baseline gap-3">
              <span className="font-display-lg text-display-lg text-secondary font-bold">
                {product.price.toLocaleString()} ₫
              </span>
              <span className="text-label-sm text-on-surface-variant font-medium">Inclusive of VAT</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-label-md text-label-md font-bold text-on-surface mb-2">Product Description</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-error-red'}`}></span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                {product.stock > 0 ? `In Stock (${product.stock} items available)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Action Area: Quantity & Add to Cart */}
          <div className="border-t border-outline-variant/30 pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-label-md text-label-md font-bold text-on-surface">Quantity:</label>
              <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-low">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-surface-container-high text-on-surface transition-colors font-bold"
                  type="button"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-label-md font-bold text-on-surface">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 hover:bg-surface-container-high text-on-surface transition-colors font-bold"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-full py-3 px-4 rounded-xl font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-primary text-on-primary hover:opacity-90'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-lg">
                  {isAdded ? 'check_circle' : 'add_shopping_cart'}
                </span>
                {isAdded ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3 px-4 rounded-xl font-label-md text-label-md font-bold bg-secondary text-on-secondary hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">bolt</span>
                Buy Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
