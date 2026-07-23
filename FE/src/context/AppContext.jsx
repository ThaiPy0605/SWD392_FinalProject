import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

const mapBackendProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description || '',
  price: Number(product.price),
  stock: Number(product.stockQty),
  stockQty: Number(product.stockQty),
  image: product.imageUrl || '',
  imageUrl: product.imageUrl || '',
  category: product.categoryName || '',
  categoryId: product.categoryId,
  brand: product.brandName || '',
  brandId: product.brandId,
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ohstem_user');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed?.id && parsed?.email && parsed?.role) return parsed;
      localStorage.removeItem('ohstem_user');
      return null;
    } catch {
      return null;
    }
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentAdminTab, setCurrentAdminTab] = useState('Overview');

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [metadataError, setMetadataError] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');

  const fetchMetadata = useCallback(async () => {
    setMetadataError('');
    try {
      const [categoryData, brandData] = await Promise.all([
        api.getCategories(),
        api.getBrands(),
      ]);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setBrands(Array.isArray(brandData) ? brandData : []);
    } catch (error) {
      setCategories([]);
      setBrands([]);
      setMetadataError(error.message || 'Unable to load categories and brands.');
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const authenticatedUser = {
        id: response.id,
        name: response.fullName,
        email: response.email,
        role: response.role,
        token: response.token || null,
        avatar: null,
      };
      setUser(authenticatedUser);
      localStorage.setItem('ohstem_user', JSON.stringify(authenticatedUser));
      return { success: true, user: authenticatedUser };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Invalid email or password.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ohstem_user');
    localStorage.removeItem('ohstem_token');
  };

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError('');
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data.map(mapBackendProduct) : []);
    } catch (error) {
      setProducts([]);
      setProductsError(error.message || 'Unable to load products.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchMetadata();
  }, [fetchMetadata, fetchProducts]);

  const toProductPayload = (product) => ({
    name: product.name.trim(),
    description: product.description?.trim() || '',
    price: Number(product.price),
    stockQty: Number(product.stockQty ?? product.stock),
    imageUrl: product.imageUrl?.trim() || product.image?.trim() || '',
    categoryId: Number(product.categoryId),
    brandId: Number(product.brandId),
  });

  const addProduct = async (product) => {
    const created = await api.createProduct(toProductPayload(product));
    await fetchProducts();
    return created;
  };

  const updateProduct = async (id, product) => {
    const updated = await api.updateProduct(id, toProductPayload(product));
    await fetchProducts();
    return updated;
  };

  const deleteProduct = async (id) => {
    await api.deleteProduct(id);
    await fetchProducts();
  };

  // The current backend has no cart API. This is intentional device-local cart state,
  // not seeded/mock server data.
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ohstem_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ohstem_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.removeItem('ohstem_cart');
    localStorage.removeItem('ohstem_products');
    localStorage.removeItem('ohstem_orders');
  }, []);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((current) => current.map((item) => (
      item.id === id ? { ...item, quantity } : item
    )));
  };

  const clearCart = () => setCart([]);
  const shippingFee = 35000;
  const getSubtotal = () => cart.reduce(
    (total, item) => total + (Number(item.price) * item.quantity),
    0,
  );
  const getDiscountAmount = () => 0;
  const getTotal = () => getSubtotal() + shippingFee;

  // Orders, vouchers and registration are not exposed by the current backend.
  // Keep these states empty so the UI never presents locally invented records as API data.
  const orders = [];
  const unavailable = () => {
    throw new Error('This action is not available because the backend does not provide this API yet.');
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      products,
      productsError,
      loadingProducts,
      fetchProducts,
      categories,
      brands,
      metadataError,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      voucher: null,
      applyVoucher: unavailable,
      shippingFee,
      getSubtotal,
      getDiscountAmount,
      getTotal,
      orders,
      placeOrder: unavailable,
      updateOrderStatus: unavailable,
      addNewOrder: unavailable,
      showLoginPrompt,
      setShowLoginPrompt,
      currentAdminTab,
      setCurrentAdminTab,
    }}>
      {children}
    </AppContext.Provider>
  );
};
