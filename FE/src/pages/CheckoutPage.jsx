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
    shippingFee,
    getSubtotal,
    getTotal,
  } = useApp();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    if (user?.name && !fullName) setFullName(user.name);
  }, [fullName, user]);

  const validate = () => {
    const nextErrors = {};
    if (!fullName.trim()) nextErrors.fullName = 'Please enter the recipient name.';
    if (!phone.trim()) nextErrors.phone = 'Please enter a phone number.';
    else if (!/^\d{8,11}$/.test(phone.trim())) nextErrors.phone = 'Use 8–11 digits.';
    if (!address.trim()) nextErrors.address = 'Please enter the delivery address.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOrder = () => {
    setCheckoutError('');
    if (!validate()) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setCheckoutError(
      'Checkout cannot be completed yet because the backend does not provide cart, order, payment, or voucher APIs.',
    );
  };

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

  return (
    <div className="checkout-page">
      <div className="checkout-intro">
        <div>
          <span className="eyebrow">Your cart</span>
          <h1>Review your learning kits.</h1>
          <p>Cart items are stored on this device until the backend provides cart and order APIs.</p>
        </div>
        <div className="checkout-progress" aria-label="Checkout progress">
          <span className="is-complete"><b>1</b> Cart</span>
          <i />
          <span className="is-current" aria-current="step"><b>2</b> Details</span>
          <i />
          <span><b>3</b> Order API</span>
        </div>
      </div>

      {!user && (
        <div className="checkout-notice">
          <span className="material-symbols-outlined" aria-hidden="true">info</span>
          <p><strong>Sign in required.</strong> Sign in before attempting checkout.</p>
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
                <p>These details are not submitted until an order API is available.</p>
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
                <p>Payment selection will be enabled when the backend supports checkout.</p>
              </div>
            </div>
            <div className="payment-options">
              <label className="is-selected">
                <input type="radio" name="payment" checked readOnly />
                <span className="material-symbols-outlined" aria-hidden="true">payments</span>
                <span><strong>Cash on delivery</strong><small>Planned payment method</small></span>
                <i />
              </label>
            </div>
          </section>
        </div>

        <aside className="checkout-summary">
          <div className="checkout-summary__heading">
            <div>
              <span className="eyebrow">Cart summary</span>
              <h2>{cart.length} {cart.length === 1 ? 'item' : 'items'}</h2>
            </div>
            <Link to="/">Add more</Link>
          </div>

          <div className="checkout-items">
            {cart.map((item) => (
              <article className="checkout-item" key={item.id}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <span className="material-symbols-outlined" aria-label="No product image">image_not_supported</span>
                )}
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.brand} · {item.category}</p>
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

          <div className="checkout-totals">
            <p><span>Subtotal</span><strong>{getSubtotal().toLocaleString()} ₫</strong></p>
            <p><span>Shipping estimate</span><strong>{shippingFee.toLocaleString()} ₫</strong></p>
            <p className="checkout-total"><span>Estimated total</span><strong>{getTotal().toLocaleString()} ₫</strong></p>
          </div>

          {checkoutError && <p className="is-error" role="alert">{checkoutError}</p>}
          <button type="button" className="checkout-submit" onClick={handleOrder}>
            Check checkout availability
            <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </button>
          <p className="checkout-secure">
            <span className="material-symbols-outlined" aria-hidden="true">info</span>
            No order will be created until the backend exposes an order API.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
