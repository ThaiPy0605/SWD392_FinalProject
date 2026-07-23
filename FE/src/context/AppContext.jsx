import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

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

  const login = (email, password) => {
    const name = email.split('@')[0];
    const newUser = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      avatar: null
    };
    setUser(newUser);
    localStorage.setItem('ohstem_user', JSON.stringify(newUser));
    return true;
  };

  const loginWithGoogle = (googleUser) => {
    const newUser = {
      name: googleUser.name,
      email: googleUser.email,
      avatar: googleUser.avatar
    };
    setUser(newUser);
    localStorage.setItem('ohstem_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ohstem_user');
  };

  // 2. Stateful Products Catalog Database (for Admin actions)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('ohstem_products');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          name: "Smart Home IoT Kit",
          price: 1250000,
          rating: 4.5,
          reviews: 42,
          category: "Electronics",
          ageRange: "Age 13+",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjJhfjq53WNjjS8ixyeQH_bgHSxh6NYf5pZRGYFoVA49E8rPDhrCtNs4lvgm633VAYfBi35FIZHAxZHptmIdrJJ7ygOyGNJULq4r6C8uARS_NuJnNkzmMxJDnN5qKRIgwFcQa7ythts_MjflzEQNqBEtWs9y14DFTvlLuRHhgPr0atfN3ejV9aVoxuNQk9mEMrySQKxk0EUBjKA6XPo2eWu5qaCcMy7NJ1tmhkEbWaks07ol1sB-RLNFiCgIF0KTgfazODXvU20i4",
          sku: "IoT-SH-01",
          stock: 45
        },
        {
          id: 2,
          name: "Robotics Arm Pro",
          price: 850000,
          rating: 5.0,
          reviews: 18,
          category: "Robotics",
          ageRange: "Age 13+",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkjGxTti0KrrZupAN0xyhiiSST8MHOv1fgYkWfZkIoj9_31l2tBxir9Rg0zV2Ts5k7QwKSdJaDgJ8glN6D1sx1ADFG5iKf0LyMGtZl-16cLjXopb2Xgrrib8nh22iat1McExYzhjwJ0Sx1fJyfmYImf4GFOX7eAGSUk1AzmGIoRhmjVr-tgg7q0yT3ZW0M8EeZfj8O9V4yhYKxgkE38JfngncVB_p3OoXHz2rsuji50njZsxfecKg9CRCkTXB1-v6vHDPpeWf1St4",
          sku: "ARM-PRO-02",
          stock: 12
        },
        {
          id: 3,
          name: "Electronics Starter Pack",
          price: 450000,
          rating: 4.0,
          reviews: 89,
          category: "Electronics",
          ageRange: "Age 8-12",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks",
          sku: "EL-START-03",
          stock: 98
        },
        {
          id: 4,
          name: "OhStem Yolo:Bit Educational Robotics Kit",
          price: 790000,
          rating: 4.8,
          reviews: 56,
          category: "Robotics",
          ageRange: "Age 8-12",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYvjWiQnmEMwIUV1wItFp0mfVCgPEZoRgqaeHMbveAj0_fyD3KZVtR9FMGZQLEi3RFIVpfnltpnpuO-1Y_h1jc28U6LpDIc5KjPB6DgaS9MXZBQqNmgDBvM_mduk4doCkesie-KZjhojaW5477yOZjN3Mv_L8DV15NBxzmrxQ1JzuNeXNTL0klfOX35XpdMWChvLduhZgktYvYv76z_rley95ix4v7P8_0q9IHOc6G7j2UwlvTYuqZonIbhDbBwF2R3nhDU7cSpAU",
          sku: "YB-2023-BSC",
          stock: 30
        }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ohstem_products', JSON.stringify(products));
  }, [products]);

  // Product CRUD Handlers
  const addProduct = (newProd) => {
    setProducts(prev => [
      ...prev,
      {
        ...newProd,
        id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1,
        rating: 5.0,
        reviews: 0
      }
    ]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // 3. Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ohstem_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 4,
          name: "OhStem Yolo:Bit Educational Robotics Kit",
          price: 790000,
          quantity: 1,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYvjWiQnmEMwIUV1wItFp0mfVCgPEZoRgqaeHMbveAj0_fyD3KZVtR9FMGZQLEi3RFIVpfnltpnpuO-1Y_h1jc28U6LpDIc5KjPB6DgaS9MXZBQqNmgDBvM_mduk4doCkesie-KZjhojaW5477yOZjN3Mv_L8DV15NBxzmrxQ1JzuNeXNTL0klfOX35XpdMWChvLduhZgktYvYv76z_rley95ix4v7P8_0q9IHOc6G7j2UwlvTYuqZonIbhDbBwF2R3nhDU7cSpAU",
          sku: "YB-2023-BSC"
        },
        {
          id: 1,
          name: "Smart Home IoT Kit",
          price: 1250000,
          quantity: 1,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjJhfjq53WNjjS8ixyeQH_bgHSxh6NYf5pZRGYFoVA49E8rPDhrCtNs4lvgm633VAYfBi35FIZHAxZHptmIdrJJ7ygOyGNJULq4r6C8uARS_NuJnNkzmMxJDnN5qKRIgwFcQa7ythts_MjflzEQNqBEtWs9y14DFTvlLuRHhgPr0atfN3ejV9aVoxuNQk9mEMrySQKxk0EUBjKA6XPo2eWu5qaCcMy7NJ1tmhkEbWaks07ol1sB-RLNFiCgIF0KTgfazODXvU20i4",
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
            { id: 4, name: "OhStem Yolo:Bit Kit", sku: "YB-2023-BSC", quantity: 10, price: 850000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRa0B0vpkhpCArCq4_AlVS88ziBKu6VpQ81yvjQZdqGeq-Xqa4YfsQlm8NrPZIlDeKBvtG0Ym_BGGPYFsbdfu98Fa2J92eLc6lmCyQeyLoUm8-4HyjvyYkN9fEXKnSXo4lgOwVDbBuyOrdnuhr2DcxbOYm68AoxKG1TKyuEtENjPj4enE2_mnj9-5EGnxoffihjIy1ZPQOkTnHiQ1PZuvokW_bMdRuAYLlYaLfKGqBPMzarFMl1XBOF2wlBdiOIgQbQbjKbIySy_4" },
            { id: 1, name: "Smart Home IoT Kit", sku: "IoT-SH-01", quantity: 5, price: 1390000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_B35jskMMULsGT96RyDqG3OxxNccu6b_ku0KJSReU3h2l2ddQKh0gePm8bkwr0UzaBHM4zkWN948IlGBBVTevlElJvIZgYacg4RLPddEEXIoEvE9Stuutg3EOsvrW7qW-dscYTARkGHHlT0mLSQ8EbBEl915i8gTqfiScfCSy-Ewwvdt7ayj55Wrr2DCU8vOWkSYRMV5fNTdqkWrIYyN4mE90iOmbWm4wZFpaEEooXLTRruFSmIwEdHhL8ApQu-qsdVioeIIC0nc" }
          ]
        },
        {
          id: "OS-1023",
          customer: "Nguyen Van A",
          district: "Individual",
          address: "123 Le Loi Street, District 1, Ho Chi Minh City",
          contactName: "Nguyen Van A",
          phone: "0987654321",
          date: "Oct 23, 2023",
          paymentMethod: "COD",
          total: 2075000,
          status: "Shipped",
          items: [
            { id: 4, name: "OhStem Yolo:Bit Educational Robotics Kit", sku: "YB-2023-BSC", quantity: 1, price: 790000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYvjWiQnmEMwIUV1wItFp0mfVCgPEZoRgqaeHMbveAj0_fyD3KZVtR9FMGZQLEi3RFIVpfnltpnpuO-1Y_h1jc28U6LpDIc5KjPB6DgaS9MXZBQqNmgDBvM_mduk4doCkesie-KZjhojaW5477yOZjN3Mv_L8DV15NBxzmrxQ1JzuNeXNTL0klfOX35XpdMWChvLduhZgktYvYv76z_rley95ix4v7P8_0q9IHOc6G7j2UwlvTYuqZonIbhDbBwF2R3nhDU7cSpAU" },
            { id: 1, name: "Smart Home IoT Kit", sku: "IoT-SH-01", quantity: 1, price: 1250000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjJhfjq53WNjjS8ixyeQH_bgHSxh6NYf5pZRGYFoVA49E8rPDhrCtNs4lvgm633VAYfBi35FIZHAxZHptmIdrJJ7ygOyGNJULq4r6C8uARS_NuJnNkzmMxJDnN5qKRIgwFcQa7ythts_MjflzEQNqBEtWs9y14DFTvlLuRHhgPr0atfN3ejV9aVoxuNQk9mEMrySQKxk0EUBjKA6XPo2eWu5qaCcMy7NJ1tmhkEbWaks07ol1sB-RLNFiCgIF0KTgfazODXvU20i4" }
          ]
        },
        {
          id: "OS-1022",
          customer: "Vinschool Central Park",
          district: "District 1",
          address: "720A Dien Bien Phu Street, Ward 22, Binh Thanh District, Ho Chi Minh City",
          contactName: "Ms. Quynh",
          phone: "0909090909",
          date: "Oct 22, 2023",
          paymentMethod: "Bank Transfer",
          total: 45000000,
          status: "Shipped",
          items: [
            { id: 2, name: "Robotics Arm Pro", sku: "ARM-PRO-02", quantity: 50, price: 850000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkjGxTti0KrrZupAN0xyhiiSST8MHOv1fgYkWfZkIoj9_31l2tBxir9Rg0zV2Ts5k7QwKSdJaDgJ8glN6D1sx1ADFG5iKf0LyMGtZl-16cLjXopb2Xgrrib8nh22iat1McExYzhjwJ0Sx1fJyfmYImf4GFOX7eAGSUk1AzmGIoRhmjVr-tgg7q0yT3ZW0M8EeZfj8O9V4yhYKxgkE38JfngncVB_p3OoXHz2rsuji50njZsxfecKg9CRCkTXB1-v6vHDPpeWf1St4" },
            { id: 3, name: "Electronics Starter Pack", sku: "EL-START-03", quantity: 10, price: 450000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks" }
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

  const placeOrder = (shippingInfo, paymentMethod) => {
    const orderId = `OS-${Math.floor(1000 + Math.random() * 9000)}`;
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
