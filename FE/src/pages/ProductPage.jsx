import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProductPage = ({ searchQuery }) => {
  const { products, addToCart, categories: backendCategories } = useApp();
  
  // State for Filters
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000000); // 2 Million Max Range
  const [addedItemNotifications, setAddedItemNotifications] = useState({});

  // Dynamic Filter Categories list
  const categoryFilters = useMemo(() => {
    const defaultList = [
      { name: 'All Products', icon: 'category', value: 'All' },
      { name: 'Robotics', icon: 'precision_manufacturing', value: 'Robotics' },
      { name: 'Electronics', icon: 'memory', value: 'Electronics' },
      { name: 'Age 8-12', icon: 'child_care', value: 'Age 8-12' },
      { name: 'Age 13+', icon: 'school', value: 'Age 13+' }
    ];

    if (!backendCategories || backendCategories.length === 0) return defaultList;

    const dynamicFromBackend = backendCategories.map(c => ({
      name: c.name,
      icon: 'category',
      value: c.name
    }));

    return [
      { name: 'All Products', icon: 'category', value: 'All' },
      ...dynamicFromBackend
    ];
  }, [backendCategories]);

  // Handle Add To Cart with micro feedback
  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
    
    // Trigger temporary button text notification
    setAddedItemNotifications(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemNotifications(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    const list = products || [];
    return list.filter(product => {
      // 1. Category filter
      if (selectedFilter !== 'All') {
        if (selectedFilter === 'Age 8-12' || selectedFilter === 'Age 13+') {
          if (product.ageRange !== selectedFilter) return false;
        } else {
          if (product.category !== selectedFilter) return false;
        }
      }
      
      // 2. Price filter
      if (product.price > maxPrice) return false;

      // 3. Search query filter
      if (searchQuery) {
        return product.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [products, selectedFilter, maxPrice, searchQuery]);

  return (
    <div className="max-w-container-max mx-auto px-sm md:px-gutter py-md grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* SideNavBar - Filters */}
      <aside className="col-span-12 lg:col-span-3 bg-surface-container-low dark:bg-inverse-surface border-r border-outline-variant/30 hidden lg:flex flex-col gap-xs p-sm sticky top-[80px] h-[calc(100vh-100px)] overflow-y-auto rounded-lg">
        <div className="mb-4">
          <h2 className="font-headline-md text-headline-md text-primary">Filters</h2>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Refine your search</p>
        </div>
        
        <nav className="flex flex-col gap-1">
          {categoryFilters.map((cat) => {
            const isActive = selectedFilter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedFilter(cat.value)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 ease-in-out text-left ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">{cat.icon}</span>
                {cat.name}
              </button>
            );
          })}
        </nav>

        {/* Price Slider */}
        <div className="mt-8 border-t border-outline-variant/30 pt-4">
          <h3 className="font-label-md text-label-md font-bold mb-3">Price Range</h3>
          <input 
            type="range" 
            min="300000" 
            max="2000000" 
            step="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
          />
          <div className="flex justify-between text-label-sm text-on-surface-variant mt-2 font-semibold">
            <span>300,000 ₫</span>
            <span className="text-secondary">{maxPrice.toLocaleString()} ₫</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-lg">
        {/* Mobile Filters Navigation Bar */}
        <div className="lg:hidden flex flex-wrap gap-2 bg-surface-container-low p-2 rounded-lg border border-outline-variant/30">
          {categoryFilters.map((cat) => {
            const isActive = selectedFilter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedFilter(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm text-[12px] transition-all duration-150 ${
                  isActive 
                    ? 'bg-secondary text-on-secondary' 
                    : 'bg-white text-on-surface-variant border border-outline-variant/50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Hero Banner */}
        <div className="relative bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center">
          <div className="p-8 md:w-1/2 z-10">
            <span className="inline-block px-3 py-1 bg-primary-container text-on-primary font-label-sm text-label-sm rounded-full mb-4">New Release</span>
            <h1 className="font-display-lg text-display-lg text-primary mb-4">New Yolo:Bit Starter Kit</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
              Empower the next generation of innovators with our latest comprehensive robotics kit. Perfect for classroom and home learning.
            </p>
            <button 
              onClick={() => {
                const yoloBit = (products || []).find(p => p.id === 4);
                if (yoloBit) handleAddToCart(yoloBit);
              }}
              className="bg-primary-container text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity font-semibold animate-bounce-subtle"
            >
              Shop Now
            </button>
          </div>
          <div 
            className="w-full md:w-1/2 h-64 md:h-full min-h-[300px] bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5neTvB9hvfJq59QAbSkf-exOVlJhIOn0_zAnaNgv-vnHfXdr7G_p66ey3xyCEo-r3VR0C7oJCrmt6WQyn0BT9Pu3LlILY5dByiehun7PcNrWvc8rhQHxahhSi4vsEvvh-ZraFOFToPWwBdYFEjRROp2lfdFZU7167RZ9ELpa4xRweRzfhqnURu9aRH2ftwLSl5UC0OPfzFO4BKsuRTmhkxMPoPEPOl0HGPJ5HnZ1cu42dCehebYb_z0YyBQVM6j2a8fI_KH5hDY8')` 
            }}
          ></div>
        </div>

        {/* Product Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-xl bg-white border border-outline-variant/20 rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-outline text-6xl mb-4">sentiment_dissatisfied</span>
              <p className="text-body-lg text-on-surface-variant">No products match your filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/30 overflow-hidden flex flex-col group hover:-translate-y-1"
                >
                  <Link to={`/products/${product.id}`} className="relative overflow-hidden h-48 bg-surface-container-low flex items-center justify-center cursor-pointer">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <Link to={`/products/${product.id}`} className="hover:text-primary transition-colors">
                      <h3 className="font-headline-md text-headline-lg-mobile text-on-surface mb-2 min-h-[48px] line-clamp-2 leading-snug font-bold">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Review stars */}
                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starNum = i + 1;
                        const isHalf = product.rating >= starNum - 0.5 && product.rating < starNum;
                        const isFilled = product.rating >= starNum;
                        return (
                          <span 
                            key={i} 
                            className={`material-symbols-outlined text-warning-amber text-sm ${isFilled ? 'fill-1' : ''}`}
                            style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "" }}
                          >
                            {isHalf ? 'star_half' : isFilled ? 'star' : 'star_outline'}
                          </span>
                        );
                      })}
                      <span className="text-label-sm text-on-surface-variant ml-1 font-semibold">({product.reviews})</span>
                    </div>

                    <p className="font-headline-md text-headline-md text-secondary mb-4 mt-auto font-bold">
                      {product.price.toLocaleString()} ₫
                    </p>

                    {/* Add to Cart button */}
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`w-full py-2.5 rounded-lg font-label-md text-label-md transition-all flex justify-center items-center gap-2 font-semibold ${
                        addedItemNotifications[product.id]
                          ? 'bg-secondary text-white'
                          : 'bg-primary-container text-on-primary hover:opacity-90'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {addedItemNotifications[product.id] ? 'check' : 'add_shopping_cart'}
                      </span> 
                      {addedItemNotifications[product.id] ? 'Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
