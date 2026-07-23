import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const MainLayout = ({ children, searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    cart, 
    user, 
    logout, 
    updateQuantity, 
    removeFromCart, 
    showLoginPrompt, 
    setShowLoginPrompt 
  } = useApp();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isCheckout = location.pathname === '/checkout';

  // Calculate total count of items in the cart (sum of all quantities)
  const cartCount = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  // Handle click on "Buy" button inside popover
  const handleBuy = () => {
    setIsCartOpen(false);
    if (!user) {
      // User is not logged in, trigger global prompt
      setShowLoginPrompt(true);
    } else {
      // User is logged in, navigate to checkout
      navigate('/checkout');
    }
  };

  const handleModalLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Header */}
      <header className={`${isCheckout ? 'bg-surface-container-lowest' : 'bg-surface dark:bg-on-background text-primary dark:text-primary-fixed'} shadow-sm border-b border-outline-variant/30 sticky top-0 z-50`}>
        <div className="flex justify-between items-center px-gutter py-base max-w-container-max mx-auto w-full min-h-[64px]">
          
          {/* Left-Aligned Container: Logo & Return to Shop Link */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <img 
                alt="OhStem Logo" 
                className="h-8 object-contain" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLvfbVMXaMkf57S3VQmhZ_r_-PRLcSJYRob0t4ZRuKjIoQzVmyWxxDyjN98EQY0ox7s_lBp0MTVh6zf1jah7mvegdX2cbGkVH-pENRVXrMldE53TKS3Jj5xN-ljPJDncjyGxrrcEODE7jaNmClse3fbuo3S2dHxQZeuCIrU_4_PkjlergtN44wz4rsRi6Nr9j_iy_8bBRnuheqh7f_dO1_WwYXyrL7fDtXIWvb7D7E_rKwbK3IpilCif-A"
              />
            </Link>
            
            {/* Return to Shop link grouped directly beside logo on Checkout */}
            {isCheckout && (
              <Link 
                to="/" 
                className="flex items-center gap-1 font-label-md text-label-md text-secondary hover:text-primary transition-colors font-semibold border-l border-outline-variant/30 pl-4"
              >
                <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                Return to Shop
              </Link>
            )}
          </div>

          {/* Catalog Search (Only on catalog pages) */}
          {!isCheckout && (
            <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-body-md font-body-md" 
                placeholder="Search products..." 
                type="text"
              />
            </div>
          )}

          {/* Account & Action Links */}
          <div className="flex items-center gap-xs">
            {!isCheckout && (
              <div className="relative">
                {/* Cart Icon - Toggles Dropdown Popover */}
                <button 
                  onClick={() => setIsCartOpen(prev => !prev)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors relative group focus:outline-none"
                  title="Shopping Cart"
                >
                  <span className="material-symbols-outlined group-hover:text-secondary dark:group-hover:text-secondary-fixed transition-colors">shopping_cart</span>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-error-red text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full -mt-1 -mr-1 animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Link to="/admin" className="p-2 hover:bg-surface-container-high rounded-full transition-colors group" title="Admin Portal">
                  <span className="material-symbols-outlined group-hover:text-secondary dark:group-hover:text-secondary-fixed transition-colors">dashboard</span>
                </Link>

                {/* Cart Popover Dropdown Menu */}
                {isCartOpen && (
                  <>
                    {/* Invisible overlay to click away and close */}
                    <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 z-40 bg-transparent"></div>
                    
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-outline-variant/30 rounded-xl shadow-lg z-50 p-4 flex flex-col gap-3 text-on-surface text-left">
                      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                        <h3 className="font-label-md text-label-md font-bold text-primary">Your Cart ({cartCount} items)</h3>
                        <button onClick={() => setIsCartOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>

                      {/* Cart Items list */}
                      {cart.length === 0 ? (
                        <div className="py-8 text-center text-on-surface-variant flex flex-col items-center gap-2">
                          <span className="material-symbols-outlined text-4xl text-outline">shopping_cart_off</span>
                          <p className="text-body-md">Your cart is empty</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                            {cart.map((item) => (
                              <div key={item.id} className="flex gap-3 items-center border-b border-outline-variant/10 pb-2">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-12 h-12 object-cover rounded border border-outline-variant/20 flex-shrink-0"
                                />
                                <div className="flex-grow min-w-0">
                                  <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate leading-tight">{item.name}</h4>
                                  <p className="text-xs text-secondary mt-0.5">{(item.price).toLocaleString()} ₫</p>
                                  <div className="flex items-center justify-between mt-1">
                                    {/* Quantity controls */}
                                    <div className="flex items-center border border-outline-variant/50 rounded overflow-hidden h-6">
                                      <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-1.5 bg-surface hover:bg-surface-container text-on-surface text-xs"
                                      >
                                        -
                                      </button>
                                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                                      <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-1.5 bg-surface hover:bg-surface-container text-on-surface text-xs"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <button 
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-error-red hover:opacity-80 p-0.5"
                                      title="Remove item"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Live totals */}
                          <div className="border-t border-outline-variant/20 pt-2 flex justify-between items-center">
                            <span className="text-body-md text-on-surface-variant font-semibold">Total Price:</span>
                            <span className="text-label-md font-bold text-primary">
                              {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} ₫
                            </span>
                          </div>

                          {/* Checkout action button */}
                          <button 
                            onClick={handleBuy}
                            className="w-full bg-primary-container text-on-primary font-semibold text-label-md py-2.5 rounded-lg hover:bg-primary transition-colors text-center shadow-sm flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                            Proceed to Checkout
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-7 w-7 rounded-full object-cover border border-outline-variant/50"
                  />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[22px]">account_circle</span>
                )}
                <span className="hidden sm:inline font-label-md text-label-md text-on-surface-variant font-medium">Hi, {user.name}</span>
                <button 
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors group"
                  title="Sign Out"
                >
                  <span className="material-symbols-outlined text-error-red">logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-surface-container-high rounded-full transition-colors group" title="Sign In">
                <span className="material-symbols-outlined group-hover:text-secondary dark:group-hover:text-secondary-fixed transition-colors">account_circle</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Login Prompt Modal (Overlay) */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-sm animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setShowLoginPrompt(false)} 
            className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-sm rounded-xl shadow-lg border border-outline-variant/30 p-lg z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mb-sm shadow-sm">
              <span className="material-symbols-outlined text-2xl font-bold">lock_open</span>
            </div>
            
            <h3 className="font-headline-md text-[20px] font-bold text-on-surface mb-base">Authentication Required</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md leading-relaxed">
              Please log in to proceed with your purchase.
            </p>
            
            <div className="flex gap-sm w-full">
              <button 
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 py-2 px-4 border border-outline-variant rounded-lg font-semibold hover:bg-surface-container transition-colors text-on-surface"
              >
                Cancel
              </button>
              <button 
                onClick={handleModalLoginRedirect}
                className="flex-1 py-2 px-4 bg-primary-container text-on-primary rounded-lg font-semibold hover:bg-primary transition-colors shadow-sm"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {isCheckout ? (
        /* Simple Footer for Checkout */
        <footer className="bg-surface-gray border-t border-outline-variant w-full mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center py-lg px-gutter max-w-container-max mx-auto gap-md">
            <div className="text-headline-md font-headline-md font-bold text-primary">
              OhStem.vn
            </div>
            <nav className="flex flex-wrap justify-center gap-md">
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Help Center</a>
              <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">Contact</a>
            </nav>
            <div className="font-body-md text-body-md text-on-surface-variant">
              © 2024 OhStem.vn. All rights reserved.
            </div>
          </div>
        </footer>
      ) : (
        /* Full Footer for Product Catalog */
        <footer className="bg-surface-container-highest dark:bg-on-background text-on-surface dark:text-on-background border-t border-outline-variant/30 full-width py-lg mt-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter max-w-container-max mx-auto">
            <div className="col-span-1 md:col-span-1">
              <div className="font-headline-md text-headline-md text-primary mb-4">OhStem.vn</div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">Empowering STEM education through innovative robotics and IoT solutions.</p>
              <div className="font-label-sm text-label-sm text-on-surface-variant opacity-90">
                © 2024 OhStem Education. All rights reserved.
              </div>
            </div>
            <div>
              <h4 className="font-label-md text-label-md font-bold mb-4">Company</h4>
              <ul className="flex flex-col gap-2 font-label-sm text-label-sm">
                <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all opacity-90 hover:opacity-100" href="#">About Us</a></li>
                <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all opacity-90 hover:opacity-100" href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-label-md font-bold mb-4">Legal</h4>
              <ul className="flex flex-col gap-2 font-label-sm text-label-sm">
                <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all opacity-90 hover:opacity-100" href="#">Privacy Policy</a></li>
                <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all opacity-90 hover:opacity-100" href="#">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-label-md font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined">share</span>
                </a>
                <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined">mail</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
