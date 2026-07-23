import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

const AdminPage = ({ searchQuery }) => {
  const { 
    orders, 
    updateOrderStatus, 
    addNewOrder, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    currentAdminTab
  } = useApp();

  // Active tab selection (Overview, Orders, Products, Customers)
  const activeTab = currentAdminTab || 'Overview';

  // 1. Orders Tab States - Default to null so slide-over drawer stays hidden until clicked
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('Processing');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // New Order Form States
  const [newCustName, setNewCustName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPayment, setNewPayment] = useState('Bank Transfer');
  const [selectedProdId, setSelectedProdId] = useState('1');
  const [prodQty, setProdQty] = useState(1);
  const [orderError, setOrderError] = useState('');

  // 2. Products Tab States
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProdId, setEditingProdId] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    sku: '',
    category: 'Robotics',
    price: '',
    stock: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks',
    ageRange: 'Age 8-12'
  });
  const [prodError, setProdError] = useState('');

  // ----------------------------------------------------
  // Dynamic derived states
  // ----------------------------------------------------

  // Calculate unique customer list dynamically from orders
  const customersList = useMemo(() => {
    const list = {};
    const ordersList = orders || [];
    ordersList.forEach(o => {
      const name = o.customer;
      if (!list[name]) {
        list[name] = {
          name: name,
          email: o.email || `${name.toLowerCase().replace(/\s+/g, '')}@school.edu.vn`,
          phone: o.phone,
          ordersCount: 0,
          totalSpent: 0
        };
      }
      list[name].ordersCount += 1;
      list[name].totalSpent += o.total;
    });
    return Object.values(list);
  }, [orders]);

  // Overall analytics metrics
  const metrics = useMemo(() => {
    const ordersList = orders || [];
    const validOrders = ordersList.filter(o => o.status !== 'Cancelled');
    const revenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    const activeProdsCount = products ? products.length : 0;
    const uniqueCusts = new Set(ordersList.map(o => o.customer)).size;

    return {
      revenue,
      ordersCount: ordersList.length,
      productsCount: activeProdsCount,
      customersCount: uniqueCusts
    };
  }, [orders, products]);

  // Active order details for drawer
  const activeOrderDetails = useMemo(() => {
    if (!selectedOrderId) return null;
    return (orders || []).find(o => o.id === selectedOrderId);
  }, [orders, selectedOrderId]);

  // ----------------------------------------------------
  // Filters & Search Bindings
  // ----------------------------------------------------

  // Filtered Orders for the Table
  const filteredOrders = useMemo(() => {
    let list = orders || [];
    if (orderStatusFilter !== 'All') {
      list = list.filter(o => o.status === orderStatusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customer.toLowerCase().includes(q) || 
        o.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, orderStatusFilter, searchQuery]);

  // Filtered Products for the table
  const filteredProducts = useMemo(() => {
    let list = products || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, searchQuery]);

  // Filtered Customers for the table
  const filteredCustomers = useMemo(() => {
    let list = customersList;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        c.phone.includes(q)
      );
    }
    return list;
  }, [customersList, searchQuery]);

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------

  // Manual order creation
  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    setOrderError('');

    if (!newCustName.trim()) return setOrderError('Customer Name is required');
    if (!newPhone.trim()) return setOrderError('Phone Number is required');
    if (!newAddress.trim()) return setOrderError('Address is required');

    const product = products.find(p => p.id === Number(selectedProdId));
    if (!product) return;

    const items = [{
      id: product.id,
      name: product.name,
      sku: product.sku,
      quantity: Number(prodQty),
      price: product.price,
      image: product.image
    }];

    const total = product.price * Number(prodQty);

    const newOrder = {
      customer: newCustName,
      district: newAddress.split(',')[1]?.trim() || "Individual",
      address: newAddress,
      contactName: newCustName,
      phone: newPhone,
      email: `${newCustName.toLowerCase().replace(/\s+/g, '')}@school.edu.vn`,
      paymentMethod: newPayment,
      total: total,
      status: 'Processing',
      items: items
    };

    addNewOrder(newOrder);

    // Reset fields
    setNewCustName('');
    setNewPhone('');
    setNewAddress('');
    setNewPayment('Bank Transfer');
    setSelectedProdId('1');
    setProdQty(1);
    setIsOrderModalOpen(false);
  };

  // Product Add / Edit submits
  const handleProductSubmit = (e) => {
    e.preventDefault();
    setProdError('');

    if (!prodForm.name.trim()) return setProdError('Product Name is required');
    if (!prodForm.sku.trim()) return setProdError('SKU is required');
    if (!prodForm.price) return setProdError('Price is required');
    if (!prodForm.stock) return setProdError('Stock is required');

    const productData = {
      name: prodForm.name,
      sku: prodForm.sku,
      category: prodForm.category,
      price: Number(prodForm.price),
      stock: Number(prodForm.stock),
      image: prodForm.image,
      ageRange: prodForm.ageRange
    };

    if (editingProdId) {
      updateProduct(editingProdId, productData);
    } else {
      addProduct(productData);
    }

    // Reset fields
    setProdForm({
      name: '',
      sku: '',
      category: 'Robotics',
      price: '',
      stock: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks',
      ageRange: 'Age 8-12'
    });
    setEditingProdId(null);
    setIsProdModalOpen(false);
  };

  const handleEditProductClick = (prod) => {
    setEditingProdId(prod.id);
    setProdForm({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      price: prod.price,
      stock: prod.stock ?? 25,
      image: prod.image,
      ageRange: prod.ageRange || 'Age 8-12'
    });
    setIsProdModalOpen(true);
  };

  return (
    <div className="relative">
      
      {/* ---------------------------------------------------- */}
      {/* 1. OVERVIEW / ANALYTICS TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'Overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div>
            <h2 className="font-headline-lg text-admin-headline-lg text-on-surface mb-2 font-bold">Analytics Overview</h2>
            <p className="text-on-surface-variant font-body-md text-admin-body-md">Live operational summary of STEM store platforms.</p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Metric 1 */}
            <div className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Total Revenue</p>
                <p className="text-lg font-bold text-on-surface truncate mt-1">{metrics.revenue.toLocaleString()} ₫</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Total Orders</p>
                <p className="text-lg font-bold text-on-surface truncate mt-1">{metrics.ordersCount} registered</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-warning-amber/10 text-warning-amber flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Active Products</p>
                <p className="text-lg font-bold text-on-surface truncate mt-1">{metrics.productsCount} catalog items</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Unique Customers</p>
                <p className="text-lg font-bold text-on-surface truncate mt-1">{metrics.customersCount} schools/guests</p>
              </div>
            </div>
          </div>

          {/* SVG Chart & Recent Activity columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* SVG Trend Graph card */}
            <div className="lg:col-span-8 bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-headline-md text-admin-title-lg text-on-surface font-bold">Revenue Performance</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Calculated monthly earnings trajectory.</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Live updates</span>
              </div>
              
              {/* Premium Pure SVG Line graph */}
              <div className="w-full flex-grow min-h-[220px] relative">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Filled area gradient */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#006c49" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#006c49" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Graph path */}
                  <path 
                    d="M 0,160 Q 100,140 200,100 T 400,60 L 500,50 L 500,200 L 0,200 Z" 
                    fill="url(#chartGrad)"
                  />
                  
                  {/* Trend line */}
                  <path 
                    d="M 0,160 Q 100,140 200,100 T 400,60 L 500,50" 
                    fill="none" 
                    stroke="#006c49" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                  
                  {/* Data Point Circles */}
                  <circle cx="200" cy="100" r="5" fill="#ffffff" stroke="#0051d5" strokeWidth="3" />
                  <circle cx="400" cy="60" r="5" fill="#ffffff" stroke="#006c49" strokeWidth="3" />
                  <circle cx="500" cy="50" r="5" fill="#ffffff" stroke="#006c49" strokeWidth="3" />
                </svg>
              </div>
              
              <div className="flex justify-between text-xs text-on-surface-variant font-bold mt-4 pt-3 border-t border-outline-variant/10">
                <span>Jan - Mar</span>
                <span>Apr - Jun</span>
                <span className="text-primary">Jul (Current Peak)</span>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="lg:col-span-4 bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="font-headline-md text-admin-title-lg text-on-surface font-bold mb-4">Recent Activity</h3>
              <div className="flex-grow space-y-4 overflow-y-auto max-h-[260px] pr-1">
                {orders && orders.length > 0 ? (
                  orders.map((o, idx) => (
                    <div key={idx} className="flex gap-3 text-admin-body-md">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        o.status === 'Processing' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                      }`}>
                        <span className="material-symbols-outlined text-sm">
                          {o.status === 'Processing' ? 'pending' : 'local_shipping'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-on-surface leading-tight truncate">Order #{o.id} - {o.status}</p>
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">{o.customer}</p>
                        <p className="text-[10px] text-outline mt-0.5">{o.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant">No activity recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. ORDERS MANAGEMENT TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'Orders' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-lg text-admin-headline-lg text-on-surface mb-2 font-bold">Order Registry</h2>
              <p className="text-on-surface-variant font-body-md text-admin-body-md">Approve and dispatch order transactions.</p>
            </div>
            <button 
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-admin-primary text-on-primary px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-admin-primary-container transition-colors shadow-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Order
            </button>
          </div>

          {/* Table Filters */}
          <div className="flex gap-4 border-b border-outline-variant mb-2">
            {['All', 'Processing', 'Shipped', 'Cancelled'].map((t) => {
              const count = t === 'All' ? orders.length : orders.filter(o => o.status === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setOrderStatusFilter(t)}
                  className={`pb-3 text-admin-title-md font-bold transition-all relative ${
                    orderStatusFilter === t 
                      ? 'text-admin-primary border-b-2 border-admin-primary' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {t} <span className="text-xs text-outline font-semibold">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Orders Grid/Table */}
          <div className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Order ID</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Customer</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Payment</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider text-right">Total</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="text-admin-body-md text-on-surface divide-y divide-surface-container-high font-medium">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-on-surface-variant">No orders match these criteria.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr 
                        key={o.id}
                        onClick={() => setSelectedOrderId(o.id)}
                        className={`hover:bg-surface-container-low transition-colors cursor-pointer ${
                          o.id === selectedOrderId ? 'bg-surface-container-low/60 font-bold' : ''
                        }`}
                      >
                        <td className="py-4 px-4 font-bold text-admin-primary">#{o.id}</td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-on-surface text-admin-body-lg leading-tight">{o.customer}</div>
                          <div className="text-xs text-on-surface-variant font-normal">{o.district}</div>
                        </td>
                        <td className="py-4 px-4 text-on-surface-variant">{o.date}</td>
                        <td className="py-4 px-4 text-on-surface-variant">{o.paymentMethod}</td>
                        <td className="py-4 px-4 text-right font-bold">{o.total.toLocaleString()} ₫</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            o.status === 'Processing' ? 'bg-primary-fixed/50 text-on-primary-fixed' :
                            o.status === 'Shipped' ? 'bg-admin-secondary-container/50 text-admin-on-secondary-container' : 'bg-error-container/50 text-error'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              o.status === 'Processing' ? 'bg-primary' : o.status === 'Shipped' ? 'bg-secondary' : 'bg-error'
                            }`}></span>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. PRODUCTS MANAGEMENT TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'Products' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-lg text-admin-headline-lg text-on-surface mb-2 font-bold">Catalog Management</h2>
              <p className="text-on-surface-variant font-body-md text-admin-body-md">Configure product models, details, and stock reserves.</p>
            </div>
            <button 
              onClick={() => {
                setEditingProdId(null);
                setProdForm({
                  name: '',
                  sku: '',
                  category: 'Robotics',
                  price: '',
                  stock: '',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks',
                  ageRange: 'Age 8-12'
                });
                setIsProdModalOpen(true);
              }}
              className="bg-admin-primary text-on-primary px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:bg-admin-primary-container transition-colors shadow-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Product
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Image</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Model Name</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">SKU</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider text-right">Price</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Stock</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-admin-body-md text-on-surface divide-y divide-surface-container-high font-medium">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-on-surface-variant">No products found.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-4">
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded border border-outline-variant/30" />
                        </td>
                        <td className="py-3 px-4 text-admin-title-md font-semibold text-on-surface">{p.name}</td>
                        <td className="py-3 px-4 text-on-surface-variant">{p.sku}</td>
                        <td className="py-3 px-4">
                          <span className="bg-surface-container px-2.5 py-1 rounded text-xs text-on-surface-variant font-semibold">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-secondary">{(p.price).toLocaleString()} ₫</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${
                            (p.stock ?? 25) > 15 ? 'bg-primary-fixed/40 text-on-primary-fixed' : 'bg-error-container/40 text-error'
                          }`}>
                            {p.stock ?? 25} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button 
                              onClick={() => handleEditProductClick(p)} 
                              className="p-1.5 hover:bg-surface-container text-secondary rounded" 
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button 
                              onClick={() => { if(confirm('Delete product?')) deleteProduct(p.id); }} 
                              className="p-1.5 hover:bg-error-container/20 text-error rounded" 
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. CUSTOMERS REGISTRY TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'Customers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div>
            <h2 className="font-headline-lg text-admin-headline-lg text-on-surface mb-2 font-bold">Customer Directory</h2>
            <p className="text-on-surface-variant font-body-md text-admin-body-md">Register of purchasing organizations and individual profiles.</p>
          </div>

          {/* Customers Table */}
          <div className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Client Name</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Contact Mail</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider">Phone</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider text-center">Orders Placed</th>
                    <th className="py-3 px-4 font-label-md text-admin-label-md text-on-surface-variant uppercase tracking-wider text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="text-admin-body-md text-on-surface divide-y divide-surface-container-high font-medium">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-on-surface-variant">No client accounts found.</td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-4 font-bold text-on-surface text-admin-body-lg">{c.name}</td>
                        <td className="py-4 px-4 text-on-surface-variant">{c.email}</td>
                        <td className="py-4 px-4 text-on-surface-variant">{c.phone}</td>
                        <td className="py-4 px-4 text-center font-bold">{c.ordersCount} orders</td>
                        <td className="py-4 px-4 text-right font-extrabold text-primary">{(c.totalSpent).toLocaleString()} ₫</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* OVERLAY DRAWER PANEL (Orders details) */}
      {/* ---------------------------------------------------- */}
      {activeOrderDetails && activeTab === 'Orders' && (
        <>
          <div onClick={() => setSelectedOrderId(null)} className="fixed inset-0 bg-inverse-surface/40 z-30 transition-opacity"></div>
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-surface-container-lowest shadow-[-4px_0_24px_rgba(0,0,0,0.1)] z-40 flex flex-col border-l border-outline-variant transform transition-transform duration-300 ease-in-out translate-x-0">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <div>
                <h3 className="font-headline-md text-admin-title-lg text-on-surface font-bold">Order Details</h3>
                <p className="font-label-md text-admin-primary font-bold mt-1">#{activeOrderDetails.id}</p>
              </div>
              <button onClick={() => setSelectedOrderId(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Drawer Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8 font-medium">
              <section>
                <h4 className="font-label-md text-admin-label-md text-on-surface-variant mb-3 uppercase tracking-wider">Customer Info</h4>
                <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant space-y-2">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-outline">business</span>
                    <span className="font-semibold text-on-surface">{activeOrderDetails.customer}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-outline">call</span>
                    <span className="text-on-surface">{activeOrderDetails.phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-outline">location_on</span>
                    <span className="text-on-surface-variant leading-tight">{activeOrderDetails.address}</span>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="font-label-md text-admin-label-md text-on-surface-variant mb-3 uppercase tracking-wider font-bold">Purchased Items</h4>
                <div className="border border-outline-variant rounded-lg divide-y divide-surface-container-high overflow-hidden shadow-sm">
                  {activeOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-white items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border" />
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-on-surface truncate text-admin-title-md leading-tight">{item.name}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-on-surface">x{item.quantity}</p>
                        <p className="text-xs text-on-surface-variant font-bold">{(item.price).toLocaleString()} ₫</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="bg-surface-container rounded-lg p-4 font-bold text-admin-body-lg">
                  <div className="flex justify-between text-on-surface-variant font-semibold">
                    <span>Subtotal</span>
                    <span>{activeOrderDetails.total.toLocaleString()} ₫</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-semibold mt-1">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="pt-2 border-t border-outline-variant mt-2 flex justify-between font-bold text-admin-title-lg text-primary">
                    <span>Total</span>
                    <span>{activeOrderDetails.total.toLocaleString()} ₫</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-outline-variant bg-surface-bright flex gap-3">
              {activeOrderDetails.status === 'Processing' ? (
                <>
                  <button 
                    onClick={() => { updateOrderStatus(activeOrderDetails.id, 'Cancelled'); setSelectedOrderId(null); }}
                    className="flex-grow py-2.5 border rounded-lg hover:bg-surface-container font-bold text-on-surface"
                  >
                    Cancel Order
                  </button>
                  <button 
                    onClick={() => { updateOrderStatus(activeOrderDetails.id, 'Shipped'); setSelectedOrderId(null); }}
                    className="flex-grow py-2.5 bg-admin-primary text-on-primary rounded-lg hover:bg-admin-primary-container font-bold shadow-sm"
                  >
                    Ship Order
                  </button>
                </>
              ) : (
                <div className="w-full text-center py-2.5 bg-surface-container rounded-lg font-bold border border-outline-variant/30 text-on-surface-variant">
                  Completed status: {activeOrderDetails.status}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------- */}

      {/* Order Creator Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          <div onClick={() => setIsOrderModalOpen(false)} className="fixed inset-0 bg-inverse-surface/50"></div>
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg border border-outline-variant/30 p-lg z-10 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3 mb-md">
              <h3 className="text-admin-title-lg font-bold text-admin-primary">Register New Order</h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {orderError && (
              <div className="p-3 mb-sm bg-error-container/50 text-error border border-error/20 rounded-lg text-admin-body-md font-semibold">
                {orderError}
              </div>
            )}

            <form onSubmit={handleCreateOrderSubmit} className="space-y-sm font-semibold">
              <div>
                <label className="block text-admin-body-md text-on-surface-variant font-semibold mb-base">Customer / School Name</label>
                <input 
                  type="text" 
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Marie Curie School"
                  className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-admin-body-md text-on-surface-variant font-semibold mb-base">Contact Phone</label>
                <input 
                  type="tel" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 0901234567"
                  className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-admin-body-md text-on-surface-variant font-semibold mb-base">Delivery Address</label>
                <textarea 
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Full Address details"
                  rows="2"
                  className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-admin-body-md text-on-surface-variant font-semibold mb-base">Product Item</label>
                  <select 
                    value={selectedProdId}
                    onChange={(e) => setSelectedProdId(e.target.value)}
                    className="w-full border border-outline-variant rounded-lg p-sm bg-white text-admin-body-lg outline-none"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-admin-body-md text-on-surface-variant font-semibold mb-base">Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={prodQty}
                    onChange={(e) => setProdQty(Math.max(1, Number(e.target.value)))}
                    className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-admin-body-md text-on-surface-variant font-semibold mb-base">Payment Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-admin-body-md">
                    <input 
                      type="radio" 
                      name="newPayment"
                      value="Bank Transfer"
                      checked={newPayment === 'Bank Transfer'}
                      onChange={() => setNewPayment('Bank Transfer')}
                      className="text-admin-primary focus:ring-admin-primary"
                    />
                    Bank Transfer
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-admin-body-md">
                    <input 
                      type="radio" 
                      name="newPayment"
                      value="COD"
                      checked={newPayment === 'COD'}
                      onChange={() => setNewPayment('COD')}
                      className="text-admin-primary focus:ring-admin-primary"
                    />
                    COD
                  </label>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-4 flex gap-sm justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg font-semibold hover:bg-surface-container transition-colors text-admin-body-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-admin-primary text-on-primary rounded-lg font-semibold hover:bg-admin-primary-container transition-colors shadow-sm text-admin-body-lg"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Creator/Editor Modal */}
      {isProdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          <div onClick={() => setIsProdModalOpen(false)} className="fixed inset-0 bg-inverse-surface/50"></div>
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg border border-outline-variant/30 p-lg z-10 flex flex-col max-h-[90vh] overflow-y-auto font-medium">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3 mb-md">
              <h3 className="text-admin-title-lg font-bold text-admin-primary">
                {editingProdId ? 'Modify Product Model' : 'Register New Product'}
              </h3>
              <button onClick={() => setIsProdModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {prodError && (
              <div className="p-3 mb-sm bg-error-container/50 text-error border border-error/20 rounded-lg text-admin-body-md font-semibold">
                {prodError}
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-sm font-semibold">
              <div>
                <label className="block text-admin-body-md text-on-surface-variant mb-base font-bold">Product Name</label>
                <input 
                  type="text" 
                  value={prodForm.name}
                  onChange={(e) => setProdForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Smart IoT Weather Station"
                  className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-admin-body-md text-on-surface-variant mb-base font-bold">SKU Code</label>
                  <input 
                    type="text" 
                    value={prodForm.sku}
                    onChange={(e) => setProdForm(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="e.g. IoT-WE-09"
                    className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-admin-body-md text-on-surface-variant mb-base font-bold">Category</label>
                  <select 
                    value={prodForm.category}
                    onChange={(e) => setProdForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg p-sm bg-white text-admin-body-lg outline-none"
                  >
                    <option value="Robotics">Robotics</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-admin-body-md text-on-surface-variant mb-base font-bold">Price (₫)</label>
                  <input 
                    type="number" 
                    value={prodForm.price}
                    onChange={(e) => setProdForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 750000"
                    className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-admin-body-md text-on-surface-variant mb-base font-bold">Stock Reserve</label>
                  <input 
                    type="number" 
                    value={prodForm.stock}
                    onChange={(e) => setProdForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="e.g. 50"
                    className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-admin-body-md text-on-surface-variant mb-base font-bold">Age Bracket</label>
                  <select 
                    value={prodForm.ageRange}
                    onChange={(e) => setProdForm(prev => ({ ...prev, ageRange: e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg p-sm bg-white text-admin-body-lg outline-none"
                  >
                    <option value="Age 8-12">Age 8-12</option>
                    <option value="Age 13+">Age 13+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-admin-body-md text-on-surface-variant mb-base font-bold">Image URL</label>
                  <input 
                    type="text" 
                    value={prodForm.image}
                    onChange={(e) => setProdForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg p-sm text-admin-body-lg focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-4 flex gap-sm justify-end font-semibold">
                <button 
                  type="button" 
                  onClick={() => setIsProdModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors text-admin-body-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-admin-primary text-on-primary rounded-lg hover:bg-admin-primary-container transition-colors shadow-sm text-admin-body-lg"
                >
                  {editingProdId ? 'Update Info' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
