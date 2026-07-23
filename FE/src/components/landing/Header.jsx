import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import SearchBar from './SearchBar';

const Header = ({ searchQuery = '', setSearchQuery, showSearch = true }) => {
  const navigate = useNavigate();
  const { cart, user, logout } = useApp();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="landing-header">
      <div className={`landing-header__inner ${!showSearch ? 'landing-header__inner--without-search' : ''}`}>
        <Link to="/" className="landing-brand" aria-label="OhStem home">
          <span className="landing-brand__mark" aria-hidden="true">O</span>
          <span className="landing-brand__copy">
            <strong>OhStem</strong>
            <small>Build the future</small>
          </span>
        </Link>

        {showSearch ? (
          <div className="landing-header__search">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        ) : (
          <Link to="/" className="checkout-header__back">
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
            Continue shopping
          </Link>
        )}

        <nav className="landing-header__actions" aria-label="Account actions">
          {showSearch && (
            <button
              type="button"
              className="icon-button landing-header__mobile-search"
              onClick={() => setMobileSearchOpen((open) => !open)}
              aria-expanded={mobileSearchOpen}
              aria-label="Toggle search"
            >
              <span className="material-symbols-outlined" aria-hidden="true">search</span>
            </button>
          )}
          <Link to="/admin" className="icon-button" aria-label="Open admin dashboard">
            <span className="material-symbols-outlined" aria-hidden="true">space_dashboard</span>
          </Link>
          <Link to="/checkout" className="icon-button icon-button--cart" aria-label={`Cart with ${cartCount} items`}>
            <span className="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <button
              type="button"
              className="account-chip"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign out"
            >
              <span className="account-chip__avatar">{user.name?.charAt(0) || 'U'}</span>
              <span className="account-chip__name">{user.name}</span>
              <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            </button>
          ) : (
            <Link to="/login" className="account-chip account-chip--guest">
              <span className="material-symbols-outlined" aria-hidden="true">person</span>
              <span>Sign in</span>
            </Link>
          )}
        </nav>
      </div>

      {showSearch && mobileSearchOpen && (
        <div className="landing-header__mobile-search-panel">
          <SearchBar value={searchQuery} onChange={setSearchQuery} compact />
        </div>
      )}
    </header>
  );
};

export default Header;
