import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    user, 
    updateQuantity, 
    removeFromCart, 
    applyVoucher, 
    voucher,
    shippingFee,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    placeOrder,
    setShowLoginPrompt
  } = useApp();

  const cartList = cart || [];

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'vietqr'

  // Modal / Success states
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // VietQR Payment Modal State
  const [showVietQrModal, setShowVietQrModal] = useState(false);
  const [vietQrUrl, setVietQrUrl] = useState('');
  const [tempOrderIdForQr, setTempOrderIdForQr] = useState('');
  const [copyStatus, setCopyStatus] = useState({}); // { accNum: boolean, accName: boolean, note: boolean }

  // Auto-fill recipient name when user profile changes (e.g. logs in)
  useEffect(() => {
    if (user && user.name && !fullName) {
      setFullName(user.name);
    }
  }, [user]);

  // Voucher state
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMessage, setVoucherMessage] = useState({ text: '', isError: false });

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;

    if (applyVoucher) {
      const res = applyVoucher(voucherInput);
      setVoucherMessage({
        text: res.message,
        isError: !res.success
      });
      if (res.success) {
        setVoucherInput('');
      }
    }
  };

  const handlePlaceOrderClick = () => {
    // Validate inputs
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!phone.trim()) {
      errors.phone = 'Phone Number is required';
    } else if (!/^\d{8,11}$/.test(phone.trim())) {
      errors.phone = 'Invalid phone number (must be 8-11 digits)';
    }
    if (!address.trim()) errors.address = 'Delivery Address is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Guest check
    if (!user) {
      if (setShowLoginPrompt) {
        setShowLoginPrompt(true);
      }
      return;
    }

    // Generate dynamic order ID beforehand for VietQR note
    const orderId = `OS-${Math.floor(1000 + Math.random() * 9000)}`;
    setTempOrderIdForQr(orderId);

    if (paymentMethod === 'vietqr') {
      // Build VietQR image link dynamically: Bank ID = MB, Account No = 19002008888, Name = OHSTEM EDUCATION
      const amount = getTotal ? getTotal() : 0;
      const bankId = 'MB';
      const accountNo = '19002008888';
      const accountName = encodeURIComponent('OHSTEM EDUCATION');
      const addInfo = encodeURIComponent(`Order_${orderId}`);
      
      const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
      setVietQrUrl(qrUrl);
      setShowVietQrModal(true);
    } else {
      // Direct Cash on Delivery placement
      if (placeOrder) {
        const oId = placeOrder(
          { fullName, phone, address },
          'cod'
        );
        setCreatedOrderId(oId);
        setIsSuccess(true);
      }
    }
  };

  // Finalize VietQR order submission
  const handleFinalizeVietQrOrder = () => {
    setShowVietQrModal(false);
    if (placeOrder) {
      // Mock placing order with custom ID
      const oId = placeOrder(
        { fullName, phone, address },
        'vietqr'
      );
      setCreatedOrderId(oId);
      setIsSuccess(true);
    }
  };

  // Clipboard copy helper
  const handleCopyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  // 1. Success Screen View
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-gutter py-xl text-center">
        <div className="bg-white rounded-xl shadow-md border border-outline-variant/30 p-lg flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center mb-md shadow-sm">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          
          <h2 className="font-headline-lg text-headline-lg text-primary mb-xs font-bold">Order Placed Successfully!</h2>
          <p className="font-headline-md text-headline-md text-secondary mb-md">Order ID: #{createdOrderId}</p>
          
          <div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/20 text-left w-full mb-lg space-y-2 font-medium">
            <h3 className="font-label-md text-label-md font-bold text-on-surface">Shipping Summary:</h3>
            <p className="font-body-md text-body-md text-on-surface-variant"><span className="font-semibold text-on-surface">Recipient:</span> {fullName}</p>
            <p className="font-body-md text-body-md text-on-surface-variant"><span className="font-semibold text-on-surface">Phone:</span> {phone}</p>
            <p className="font-body-md text-body-md text-on-surface-variant"><span className="font-semibold text-on-surface">Address:</span> {address}</p>
            <p className="font-body-md text-body-md text-on-surface-variant"><span className="font-semibold text-on-surface">Payment:</span> {paymentMethod === 'vietqr' ? 'Online VietQR Pay' : 'Cash on Delivery (COD)'}</p>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
            Your order is now saved in the system databases. You can verify it directly in the Admin Portal!
          </p>

          <div className="flex flex-col sm:flex-row gap-md w-full justify-center">
            <Link 
              to="/" 
              className="flex-1 max-w-xs bg-surface-container text-secondary border border-secondary font-label-md text-label-md py-3 rounded-lg hover:bg-secondary hover:text-on-secondary transition-colors text-center font-bold"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/admin" 
              className="flex-1 max-w-xs bg-primary-container text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary transition-colors text-center font-bold"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart View
  if (cartList.length === 0) {
    return (
      <div className="max-w-md mx-auto px-gutter py-xl text-center">
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 p-lg flex flex-col items-center">
          <span className="material-symbols-outlined text-outline text-6xl mb-4">shopping_cart_off</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold">Your Cart is Empty</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
            You don't have any items in your shopping cart. Fill it up with our educational kits!
          </p>
          <Link 
            to="/" 
            className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-3 rounded-lg shadow-sm hover:bg-primary transition-colors font-bold"
          >
            Go to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-sm md:px-gutter py-lg max-w-container-max mx-auto w-full">
      {/* Stepper info alert for guest users */}
      {!user && (
        <div className="mb-6 p-4 bg-warning-amber/10 border border-warning-amber/20 rounded-xl text-on-surface text-body-md flex items-center justify-between gap-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-warning-amber">info</span>
            <span>You are checking out as a guest. Please log in before placing your order.</span>
          </div>
          <button 
            onClick={() => setShowLoginPrompt && setShowLoginPrompt(true)}
            className="bg-secondary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Log In Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 flex flex-col gap-lg">
          
          {/* Shipping Info Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-md md:p-gutter border border-outline-variant/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-surface-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Shipping Information</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-sm">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-base">Full Name</label>
                <input 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full rounded-lg border bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-body-md text-on-surface p-sm shadow-sm outline-none ${
                    formErrors.fullName ? 'border-error-red ring-1 ring-error-red/20' : 'border-outline-variant'
                  }`}
                  placeholder="Enter your full name" 
                  type="text"
                />
                {formErrors.fullName && <p className="text-xs text-error-red mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-base">Phone Number</label>
                <input 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full rounded-lg border bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-body-md text-on-surface p-sm shadow-sm outline-none ${
                    formErrors.phone ? 'border-error-red ring-1 ring-error-red/20' : 'border-outline-variant'
                  }`}
                  placeholder="e.g. 0912345678" 
                  type="tel"
                />
                {formErrors.phone && <p className="text-xs text-error-red mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-base">Delivery Address (School / Home)</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full rounded-lg border bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-body-md text-on-surface p-sm shadow-sm outline-none ${
                    formErrors.address ? 'border-error-red ring-1 ring-error-red/20' : 'border-outline-variant'
                  }`}
                  placeholder="Enter full address (e.g. 594 Ba Thang Hai Street, Ward 14, District 10, Ho Chi Minh City)" 
                  rows="3"
                ></textarea>
                {formErrors.address && <p className="text-xs text-error-red mt-1">{formErrors.address}</p>}
              </div>
            </div>
          </section>

          {/* Payment Method Selector Section (COD + VietQR) */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-md md:p-gutter border border-outline-variant/30 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-surface-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Payment Method</h2>
            </div>
            
            <div className="flex flex-col gap-sm">
              {/* COD Option */}
              <label className={`relative flex items-center p-sm rounded-lg border cursor-pointer hover:bg-surface transition-colors shadow-sm group ${
                paymentMethod === 'cod' ? 'border-primary-container bg-surface-container-low ring-1 ring-primary-container' : 'border-outline-variant'
              }`}>
                <input 
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 text-primary-container border-outline-variant focus:ring-primary-container focus:ring-offset-0 cursor-pointer" 
                  name="payment" 
                  type="radio" 
                  value="cod"
                />
                <div className="ml-sm flex items-center gap-sm flex-grow">
                  <span className={`material-symbols-outlined text-on-surface-variant ${paymentMethod === 'cod' ? 'text-primary-container' : ''}`}>money</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Cash on Delivery (COD)</span>
                </div>
              </label>

              {/* VietQR Option */}
              <label className={`relative flex items-center p-sm rounded-lg border cursor-pointer hover:bg-surface transition-colors shadow-sm group ${
                paymentMethod === 'vietqr' ? 'border-primary-container bg-surface-container-low ring-1 ring-primary-container' : 'border-outline-variant'
              }`}>
                <input 
                  checked={paymentMethod === 'vietqr'}
                  onChange={() => setPaymentMethod('vietqr')}
                  className="w-4 h-4 text-primary-container border-outline-variant focus:ring-primary-container focus:ring-offset-0 cursor-pointer" 
                  name="payment" 
                  type="radio" 
                  value="vietqr"
                />
                <div className="ml-sm flex items-center gap-sm flex-grow">
                  <span className={`material-symbols-outlined text-on-surface-variant ${paymentMethod === 'vietqr' ? 'text-primary-container' : ''}`}>qr_code_2</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Online Payment via VietQR</span>
                    <span className="text-[11px] text-on-surface-variant font-normal">Instant activation via scan (Recommended)</span>
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-[100px]">
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-md md:p-gutter border border-outline-variant/30 flex flex-col hover:shadow-md transition-shadow">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md font-bold">Order Summary</h2>
              
              {/* Items List */}
              <div className="flex flex-col gap-sm mb-md pb-md border-b border-outline-variant/30 max-h-[300px] overflow-y-auto pr-1">
                {cartList.map((item) => (
                  <div key={item.id} className="flex items-center gap-sm">
                    <div className="w-16 h-16 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden border border-outline-variant/20 relative group">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="font-label-md text-label-md text-on-surface line-clamp-2 leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-outline-variant/50 rounded-lg overflow-hidden h-8">
                          <button 
                            onClick={() => updateQuantity && updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 bg-surface hover:bg-surface-container-high text-on-surface text-sm transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 text-body-md font-semibold text-on-surface min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity && updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 bg-surface hover:bg-surface-container-high text-on-surface text-sm transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-body-md text-body-md text-on-surface-variant font-semibold">
                            {(item.price * item.quantity).toLocaleString()} ₫
                          </span>
                          <button 
                            onClick={() => removeFromCart && removeFromCart(item.id)}
                            className="text-error hover:text-error-red transition-colors p-1"
                            title="Remove"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher Form */}
              <form onSubmit={handleApplyVoucher} className="mb-md pb-md border-b border-outline-variant/30 flex flex-col gap-2">
                <div className="flex gap-sm">
                  <input 
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    className="flex-grow rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-body-md text-on-surface p-sm shadow-sm outline-none" 
                    placeholder="OHSTEM10 or FREESHIP" 
                    type="text"
                  />
                  <button 
                    type="submit"
                    className="bg-surface-container text-secondary border border-secondary font-label-md text-label-md px-sm rounded-lg hover:bg-secondary hover:text-on-secondary transition-colors shadow-sm font-bold"
                  >
                    Apply
                  </button>
                </div>
                
                {voucherMessage.text && (
                  <p className={`text-xs ${voucherMessage.isError ? 'text-error-red' : 'text-primary-container'} font-semibold mt-1`}>
                    {voucherMessage.text}
                  </p>
                )}
                
                {voucher && (
                  <div className="flex items-center justify-between bg-primary-container/10 p-2 rounded-lg text-primary-container text-xs font-semibold">
                    <span>Active Voucher: {voucher.code}</span>
                    <span>{voucher.discountPercent > 0 ? `-${voucher.discountPercent}%` : 'Free Shipping'}</span>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-xs mb-md font-body-md text-body-md text-on-surface-variant font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-semibold">
                    {getSubtotal ? getSubtotal().toLocaleString() : 0} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-on-surface font-semibold">
                    {voucher?.freeShipping ? 'Free' : `${(shippingFee ?? 35000).toLocaleString()} ₫`}
                  </span>
                </div>
                {getDiscountAmount && getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-primary-container font-semibold">
                    <span>Discount</span>
                    <span>-{getDiscountAmount().toLocaleString()} ₫</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-md pt-sm border-t border-outline-variant/30">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">Total</span>
                <span className="font-headline-lg text-headline-lg text-primary font-bold">
                  {getTotal ? getTotal().toLocaleString() : 0} ₫
                </span>
              </div>

              {/* Action Button */}
              <button 
                onClick={handlePlaceOrderClick}
                className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-primary-container/90 transition-all flex items-center justify-center gap-xs font-bold"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                Place Order
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* VietQR Payment Modal */}
      {showVietQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-sm animate-fade-in">
          {/* Backdrop */}
          <div onClick={() => setShowVietQrModal(false)} className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm"></div>
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg border border-outline-variant/30 p-md sm:p-lg z-10 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3 mb-md">
              <h3 className="font-headline-md text-[20px] font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                Scan VietQR to Pay
              </h3>
              <button onClick={() => setShowVietQrModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-md">
              {/* QR Image */}
              <div className="p-3 bg-white border border-outline-variant/30 rounded-xl shadow-sm max-w-[240px] w-full flex justify-center items-center">
                <img 
                  src={vietQrUrl} 
                  alt="VietQR Scan Code" 
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="w-full text-center text-xs text-on-surface-variant font-medium leading-relaxed">
                Open any mobile banking application (MB, VCB, Techcom, etc.) and scan the QR code to complete transfer.
              </div>

              {/* Bank details with copy buttons */}
              <div className="w-full bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 space-y-3 font-medium text-admin-body-md text-on-surface-variant">
                <div className="flex justify-between items-center">
                  <span>Bank:</span>
                  <span className="text-on-surface font-semibold">Military Bank (MB Bank)</span>
                </div>

                <div className="flex justify-between items-center border-t border-outline-variant/10 pt-2">
                  <span>Account Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface font-bold">19002008888</span>
                    <button 
                      onClick={() => handleCopyToClipboard('19002008888', 'accNum')}
                      className="text-secondary hover:text-primary p-1 focus:outline-none"
                      title="Copy Account Number"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">
                        {copyStatus.accNum ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-outline-variant/10 pt-2">
                  <span>Account Name:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface font-bold">OHSTEM EDUCATION</span>
                    <button 
                      onClick={() => handleCopyToClipboard('OHSTEM EDUCATION', 'accName')}
                      className="text-secondary hover:text-primary p-1 focus:outline-none"
                      title="Copy Account Name"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">
                        {copyStatus.accName ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-outline-variant/10 pt-2">
                  <span>Amount:</span>
                  <span className="text-primary font-bold">
                    {getTotal ? getTotal().toLocaleString() : 0} ₫
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-outline-variant/10 pt-2">
                  <span>Transfer Note:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface font-bold">Order_{tempOrderIdForQr}</span>
                    <button 
                      onClick={() => handleCopyToClipboard(`Order_${tempOrderIdForQr}`, 'note')}
                      className="text-secondary hover:text-primary p-1 focus:outline-none"
                      title="Copy Note"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">
                        {copyStatus.note ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action triggers */}
              <div className="flex gap-sm w-full pt-4 border-t border-outline-variant/20">
                <button 
                  onClick={() => setShowVietQrModal(false)}
                  className="flex-1 py-3 px-4 border border-outline-variant rounded-lg font-semibold hover:bg-surface-container transition-colors text-on-surface text-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFinalizeVietQrOrder}
                  className="flex-1 py-3 px-4 bg-primary-container text-on-primary rounded-lg font-bold hover:bg-primary transition-all shadow-sm text-center flex justify-center items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                  I have paid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
