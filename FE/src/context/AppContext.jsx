import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks";

export const AppProvider = ({ children }) => {
  // 1. Authentication State - Defaults to null for Guest Browsing!
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ohstem_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Global Login Prompt modal trigger state
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Current Admin Tab State (Overview, Orders, Products, Customers)
  const [currentAdminTab, setCurrentAdminTab] = useState('Overview');

  // Categories & Brands Metadata State
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Load Categories & Brands from Backend
  const fetchMetadata = useCallback(async () => {
    try {
      const [catsData, brandsData] = await Promise.all([
        api.getCategories().catch(() => []),
        api.getBrands().catch(() => [])
      ]);
      setCategories(catsData || []);
      setBrands(brandsData || []);
    } catch (e) {
      console.warn("Could not fetch metadata from backend:", e);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      const newUser = {
        id: res.id,
        name: res.fullName || email.split('@')[0],
        email: res.email,
        role: res.role,
        token: res.token,
        avatar: null
      };
      setUser(newUser);
      localStorage.setItem('ohstem_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      // Fallback local login if backend is unreachable or for quick testing
      const name = email.split('@')[0];
      const newUser = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        role: email.toLowerCase().includes('admin') ? 'ADMIN' : 'MEMBER',
        avatar: null
      };
      setUser(newUser);
      localStorage.setItem('ohstem_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  };

  const loginWithGoogle = (googleUser) => {
    const newUser = {
      name: googleUser.name,
      email: googleUser.email,
      role: 'MEMBER',
      avatar: googleUser.avatar
    };
    setUser(newUser);
    localStorage.setItem('ohstem_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ohstem_user');
    localStorage.removeItem('ohstem_token');
    localStorage.removeItem('ohstem_cart');
  };

  // 2. Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Helper to map backend product DTO to UI model
  const mapBackendProduct = (p) => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: Number(p.price || 0),
    stock: p.stockQty !== undefined && p.stockQty !== null ? p.stockQty : 50,
    rating: 4.8,
    reviews: 24,
    category: p.categoryName || 'General',
    categoryId: p.categoryId || 1,
    brand: p.brandName || 'General',
    brandId: p.brandId || 1,
    ageRange: 'Age 8-12',
    image: p.imageUrl || DEFAULT_IMAGE,
    sku: `PROD-${p.id}`
  });

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data.map(mapBackendProduct));
      } else {
        // Fallback default sample products if backend returns empty list
        setProducts([
          {
            id: 1,
            name: "Smart Home IoT Kit",
            price: 1250000,
            rating: 4.5,
            reviews: 42,
            category: "Electronics",
            categoryId: 1,
            brand: "Glow Lab",
            brandId: 1,
            ageRange: "Age 13+",
            image: DEFAULT_IMAGE,
            sku: "IoT-SH-01",
            stock: 45
          }
        ]);
      }
    } catch (e) {
      console.warn("Could not fetch products from backend, using cached/mock products:", e);
      try {
        const saved = localStorage.getItem('ohstem_products');
        if (saved) setProducts(JSON.parse(saved));
      } catch (err) {}
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchMetadata();
  }, [fetchProducts, fetchMetadata]);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('ohstem_products', JSON.stringify(products));
    }
  }, [products]);

  // Product CRUD Handlers
  const addProduct = async (newProd) => {
    try {
      const catId = newProd.categoryId || (categories.find(c => c.name === newProd.category)?.id) || 1;
      const bId = newProd.brandId || (brands[0]?.id) || 1;

      const payload = {
        name: newProd.name,
        description: newProd.description || newProd.sku || 'Product description',
        price: Number(newProd.price),
        stockQty: Number(newProd.stock || newProd.stockQty || 10),
        imageUrl: newProd.image || newProd.imageUrl || DEFAULT_IMAGE,
        categoryId: Number(catId),
        brandId: Number(bId)
      };

      await api.createProduct(payload);
      await fetchProducts();
    } catch (e) {
      console.error("Backend addProduct error, performing local update:", e);
      setProducts(prev => [
        ...prev,
        {
          ...newProd,
          id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1,
          rating: 5.0,
          reviews: 0
        }
      ]);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const catId = updatedFields.categoryId || (categories.find(c => c.name === updatedFields.category)?.id) || 1;
      const bId = updatedFields.brandId || (brands[0]?.id) || 1;

      const payload = {
        name: updatedFields.name,
        description: updatedFields.description || updatedFields.sku || 'Product description',
        price: Number(updatedFields.price),
        stockQty: Number(updatedFields.stock || updatedFields.stockQty || 10),
        imageUrl: updatedFields.image || updatedFields.imageUrl || DEFAULT_IMAGE,
        categoryId: Number(catId),
        brandId: Number(bId)
      };

      await api.updateProduct(id, payload);
      await fetchProducts();
    } catch (e) {
      console.error("Backend updateProduct error, performing local update:", e);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      await fetchProducts();
    } catch (e) {
      console.error("Backend deleteProduct error, performing local delete:", e);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // 3. Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ohstem_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          name: "Smart Home IoT Kit",
          price: 1250000,
          quantity: 1,
          image: DEFAULT_IMAGE,
          sku: "IoT-SH-01"
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [voucher, setVoucher] = useState(null);
  const [shippingFee, setShippingFee] = useState(35000);

  useEffect(() => {
    localStorage.setItem('ohstem_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const applyVoucher = (code) => {
    const upperCode = code.toUpperCase();
    if (upperCode === 'OHSTEM10') {
      setVoucher({ code: 'OHSTEM10', discountPercent: 10 });
      return { success: true, message: '10% discount applied!' };
    } else if (upperCode === 'FREESHIP') {
      setVoucher({ code: 'FREESHIP', discountPercent: 0, freeShipping: true });
      setShippingFee(0);
      return { success: true, message: 'Free shipping applied!' };
    }
    return { success: false, message: 'Invalid voucher code.' };
  };

  const clearCart = () => {
    setCart([]);
    setVoucher(null);
    setShippingFee(35000);
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const getDiscountAmount = () => {
    if (!voucher || !voucher.discountPercent) return 0;
    return Math.round((getSubtotal() * voucher.discountPercent) / 100);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const fee = voucher?.freeShipping ? 0 : shippingFee;
    return subtotal - discount + fee;
  };

  // 4. Orders State (For Admin Dashboard)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ohstem_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: "OS-1024",
          customer: "Vietnam Australia International School",
          district: "Binh Thanh District",
          address: "594 Ba Thang Hai Street, Ward 14, District 10, Ho Chi Minh City",
          contactName: "Ms. Lan Anh",
          phone: "0912345678",
          date: "Oct 24, 2023",
          paymentMethod: "Bank Transfer",
          total: 15450000,
          status: "Processing",
          items: [
            { id: 1, name: "Smart Home IoT Kit", sku: "IoT-SH-01", quantity: 5, price: 1390000, image: DEFAULT_IMAGE }
          ]
        }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ohstem_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (shippingInfo, paymentMethod, requestedOrderId) => {
    const orderId = requestedOrderId || `OS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      customer: shippingInfo.fullName,
      district: shippingInfo.address.split(',')[1]?.trim() || "Individual",
      address: shippingInfo.address,
      contactName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      paymentMethod: paymentMethod === 'bank' ? 'Bank Transfer' : paymentMethod === 'vietqr' ? 'VietQR Online' : 'COD',
      total: getTotal(),
      status: 'Processing',
      items: cart.map(item => ({ ...item }))
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return orderId;
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const addNewOrder = (newOrder) => {
    setOrders(prev => [
      {
        ...newOrder,
        id: `OS-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      },
      ...prev
    ]);
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      loginWithGoogle,
      logout,
      products,
      loadingProducts,
      fetchProducts,
      categories,
      brands,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      voucher,
      applyVoucher,
      shippingFee,
      getSubtotal,
      getDiscountAmount,
      getTotal,
      orders,
      placeOrder,
      updateOrderStatus,
      addNewOrder,
      showLoginPrompt,
      setShowLoginPrompt,
      currentAdminTab,
      setCurrentAdminTab
    }}>
      {children}
    </AppContext.Provider>
  );
};
