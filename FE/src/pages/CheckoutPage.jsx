import React, { useEffect, useState } from 'react';
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
  } = useApp();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMessage, setVoucherMessage] = useState(null);
  const [qrOrderId, setQrOrderId] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');

  useEffect(() => {
    if (user?.name && !fullName) setFullName(user.name);
  }, [user, fullName]);

  const validate = () => {
    const nextErrors = {};
    if (!fullName.trim()) nextErrors.fullName = 'Please enter the recipient name.';
    if (!phone.trim()) nextErrors.phone = 'Please enter a phone number.';
    else if (!/^\d{8,11}$/.test(phone.trim())) nextErrors.phone = 'Use 8–11 digits.';
    if (!address.trim()) nextErrors.address = 'Please enter the delivery address.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const shippingInfo = { fullName, phone, address };

  const handleOrder = () => {
    if (!validate()) return;
    if (!user) {
      navigate('/login');
      return;
    }

    if (paymentMethod === 'vietqr') {
      setQrOrderId(`OS-${Math.floor(1000 + Math.random() * 9000)}`);
      setShowQr(true);
      return;
    }

    setCompletedOrderId(placeOrder(shippingInfo, 'cod'));
  };

  const handleQrConfirmation = () => {
    setShowQr(false);
    setCompletedOrderId(placeOrder(shippingInfo, 'vietqr', qrOrderId));
  };

  const handleVoucher = (event) => {
    event.preventDefault();
    if (!voucherInput.trim()) return;
    const result = applyVoucher(voucherInput);
    setVoucherMessage(result);
    if (result.success) setVoucherInput('');
  };

  if (completedOrderId) {
    return (
      <section className="checkout-state-card checkout-state-card--success">
        <span className="checkout-state-card__icon material-symbols-outlined" aria-hidden="true">check_circle</span>
        <span className="eyebrow">Order confirmed</span>
        <h1>Thank you for building with us.</h1>
        <p>Your order <strong>#{completedOrderId}</strong> is ready for processing. We will contact you with delivery updates.</p>
        <div className="checkout-state-card__actions">
          <Link to="/">Continue shopping</Link>
          <Link to="/admin">View in dashboard</Link>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout-state-card">
        <span className="checkout-state-card__icon material-symbols-outlined" aria-hidden="true">shopping_bag</span>
        <span className="eyebrow">Your cart</span>
        <h1>Ready for your next build?</h1>
        <p>Your cart is empty. Explore our robotics and electronics kits to get started.</p>
        <Link to="/" className="checkout-state-card__primary">Explore kits</Link>
      </section>
    );
  }

  const qrUrl = `https://img.vietqr.io/image/MB-19002008888-compact2.png?amount=${getTotal()}&addInfo=${encodeURIComponent(`Order_${qrOrderId}`)}&accountName=${encodeURIComponent('OHSTEM EDUCATION')}`;

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-intro">
          <div>
            <span className="eyebrow">Secure checkout</span>
            <h1>Your learning kit is almost ready.</h1>
            <p>Review your items, add delivery details, and choose how you would like to pay.</p>
          </div>
          <div className="checkout-progress" aria-label="Checkout progress">
            <span className="is-complete"><b>1</b> Cart</span>
            <i />
            <span className="is-current" aria-current="step"><b>2</b> Details</span>
            <i />
            <span><b>3</b> Done</span>
          </div>
        </div>

        {!user && (
          <div className="checkout-notice">
            <span className="material-symbols-outlined" aria-hidden="true">info</span>
            <p><strong>Sign in required.</strong> You can complete the form now; we will take you to sign in before placing the order.</p>
            <Link to="/login">Sign in</Link>
          </div>
        )}

        <div className="checkout-grid">
          <div className="checkout-column">
            <section className="checkout-card">
              <div className="checkout-card__heading">
                <span className="checkout-card__number">01</span>
                <div>
                  <h2>Delivery details</h2>
                  <p>Where should we send your order?</p>
                </div>
              </div>

              <div className="checkout-form">
                <label>
                  <span>Recipient name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nguyen Van A"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName && <small>{errors.fullName}</small>}
                </label>
                <label>
                  <span>Phone number</span>
                  <div className="checkout-phone">
                    <span>🇻🇳 +84</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))}
                      placeholder="912 345 678"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </div>
                  {errors.phone && <small>{errors.phone}</small>}
                </label>
                <label className="checkout-form__wide">
                  <span>Delivery address</span>
                  <textarea
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Street, ward, district, city"
                    rows="3"
                    autoComplete="street-address"
                    aria-invalid={Boolean(errors.address)}
                  />
                  {errors.address && <small>{errors.address}</small>}
                </label>
              </div>
            </section>

            <section className="checkout-card">
              <div className="checkout-card__heading">
                <span className="checkout-card__number">02</span>
                <div>
                  <h2>Payment method</h2>
                  <p>Choose a secure payment option.</p>
                </div>
              </div>
              <div className="payment-options">
                <label className={paymentMethod === 'cod' ? 'is-selected' : ''}>
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span className="material-symbols-outlined" aria-hidden="true">payments</span>
                  <span><strong>Cash on delivery</strong><small>Pay when your package arrives</small></span>
                  <i />
                </label>
                <label className={paymentMethod === 'vietqr' ? 'is-selected' : ''}>
                  <input type="radio" name="payment" checked={paymentMethod === 'vietqr'} onChange={() => setPaymentMethod('vietqr')} />
                  <span className="material-symbols-outlined" aria-hidden="true">qr_code_2</span>
                  <span><strong>VietQR transfer</strong><small>Instant bank transfer confirmation</small></span>
                  <i />
                </label>
              </div>
            </section>
          </div>

          <aside className="checkout-summary">
            <div className="checkout-summary__heading">
              <div>
                <span className="eyebrow">Order summary</span>
                <h2>{cart.length} {cart.length === 1 ? 'item' : 'items'}</h2>
              </div>
              <Link to="/">Add more</Link>
            </div>

            <div className="checkout-items">
              {cart.map((item) => (
                <article className="checkout-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.sku}</p>
                    <div className="checkout-item__bottom">
                      <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <strong>{(item.price * item.quantity).toLocaleString()} ₫</strong>
                    </div>
                  </div>
                  <button type="button" className="checkout-item__remove" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                    <span className="material-symbols-outlined" aria-hidden="true">close</span>
                  </button>
                </article>
              ))}
            </div>

            <form className="voucher-form" onSubmit={handleVoucher}>
              <label htmlFor="voucher">Voucher code</label>
              <div>
                <input id="voucher" value={voucherInput} onChange={(event) => setVoucherInput(event.target.value)} placeholder="OHSTEM10 or FREESHIP" />
                <button type="submit">Apply</button>
              </div>
              {voucherMessage && (
                <p className={voucherMessage.success ? 'is-success' : 'is-error'}>{voucherMessage.message}</p>
              )}
              {voucher && <span className="voucher-active">{voucher.code} applied</span>}
            </form>

            <div className="checkout-totals">
              <p><span>Subtotal</span><strong>{getSubtotal().toLocaleString()} ₫</strong></p>
              <p><span>Shipping</span><strong>{voucher?.freeShipping ? 'Free' : `${shippingFee.toLocaleString()} ₫`}</strong></p>
              {getDiscountAmount() > 0 && <p className="is-discount"><span>Discount</span><strong>−{getDiscountAmount().toLocaleString()} ₫</strong></p>}
              <p className="checkout-total"><span>Total</span><strong>{getTotal().toLocaleString()} ₫</strong></p>
            </div>

            <button type="button" className="checkout-submit" onClick={handleOrder}>
              {paymentMethod === 'vietqr' ? 'Continue to VietQR' : 'Place order'}
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
            <p className="checkout-secure">
              <span className="material-symbols-outlined" aria-hidden="true">lock</span>
              Your checkout information is protected.
            </p>
          </aside>
        </div>
      </div>

      {showQr && (
        <div className="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-title">
          <button className="qr-modal__backdrop" type="button" onClick={() => setShowQr(false)} aria-label="Close payment dialog" />
          <div className="qr-modal__card">
            <button type="button" className="qr-modal__close" onClick={() => setShowQr(false)} aria-label="Close">
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
            <span className="eyebrow">MB Bank · VietQR</span>
            <h2 id="qr-title">Scan to complete payment</h2>
            <img src={qrUrl} alt={`VietQR for order ${qrOrderId}`} />
            <div className="qr-modal__details">
              <p><span>Amount</span><strong>{getTotal().toLocaleString()} ₫</strong></p>
              <p><span>Transfer note</span><strong>Order_{qrOrderId}</strong></p>
            </div>
            <button type="button" className="checkout-submit" onClick={handleQrConfirmation}>I have completed the transfer</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
