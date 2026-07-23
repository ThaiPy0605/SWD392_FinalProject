import React from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

const CheckoutLayout = ({ children }) => (
  <div className="checkout-shell">
    <Header showSearch={false} />
    <main className="checkout-shell__main">{children}</main>
    <Footer />
  </div>
);

export default CheckoutLayout;
