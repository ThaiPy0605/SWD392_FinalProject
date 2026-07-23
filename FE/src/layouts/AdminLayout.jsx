import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const AdminLayout = ({ children, searchQuery, setSearchQuery }) => {
  const { user, logout, currentAdminTab, setCurrentAdminTab } = useApp();
  const navigate = useNavigate();

  const handleTabChange = (tabName) => {
    if (setCurrentAdminTab) {
      setCurrentAdminTab(tabName);
    }
  };

  const menuItems = [
    { name: 'Overview', label: 'Dashboard', icon: 'dashboard' },
    { name: 'Orders', label: 'Orders', icon: 'shopping_cart' },
    { name: 'Products', label: 'Products', icon: 'inventory_2' },
    { name: 'Customers', label: 'Customers', icon: 'school' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background font-body-md text-on-background">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface border-r border-outline-variant flex flex-col py-6 z-20">
        <div className="px-6 mb-8 flex items-center gap-3">
          <img 
            alt="OhStem Admin Logo" 
            className="h-8 w-8 object-contain" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLvfbVMXaMkf57S3VQmhZ_r_-PRLcSJYRob0t4ZRuKjIoQzVmyWxxDyjN98EQY0ox7s_lBp0MTVh6zf1jah7mvegdX2cbGkVH-pENRVXrMldE53TKS3Jj5xN-ljPJDncjyGxrrcEODE7jaNmClse3fbuo3S2dHxQZeuCIrU_4_PkjlergtN44wz4rsRi6Nr9j_iy_8bBRnuheqh7f_dO1_WwYXyrL7fDtXIWvb7D7E_rKwbK3IpilCif-A"
          />
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">OhStem Admin</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Management Portal</p>
          </div>
        </div>

        <nav className="flex-grow px-3 space-y-1">
          {/* Storefront Link */}
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg font-label-md text-label-md mb-2 border border-outline-variant/30 bg-white"
          >
            <span className="material-symbols-outlined">storefront</span>
            <span className="font-semibold">View Storefront</span>
          </Link>

          {/* Dynamic Tab Items */}
          {menuItems.map((item) => {
            const isActive = currentAdminTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleTabChange(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors text-left focus:outline-none ${
                  isActive 
                    ? 'bg-admin-secondary-container text-admin-on-secondary-container border-l-4 border-admin-primary rounded-r-lg font-semibold' 
                    : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Logout */}
        <div className="px-6 pt-4 border-t border-outline-variant/30">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 justify-center py-2 border border-outline-variant rounded-lg text-error-red hover:bg-error-container/20 transition-all font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-[260px] flex flex-col relative w-full">
        {/* TopNavBar Component */}
        <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-container_padding z-10">
          {/* Search bar inside header */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                placeholder={`Search ${currentAdminTab.toLowerCase()}...`} 
                type="text"
              />
            </div>
          </div>

          {/* Action Icons and Admin Info */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-title-md overflow-hidden cursor-pointer">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Admin Profile" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt-adpYatyvcvUgp1Mg-Hqzl0OHcf3bO68bPNNwh40gMqZzcR9RAEUu0CFpgmcJm17oMAcrdY14-jcwncBiqq1uks4gdNnWOf3oCMdR7BtZFQRk7tO95Ag0mu58NksCiJHIUbBAQ7D925I70hMwdEpYmZ7E9UALoxeFTnpALisH3mZlptx6My45BGa0g7MiRTqYjk_tZV2CLlBjBGAdgVBwovgqUEWrrXvsE-KkxmKt7jxC4gAh8njpLv_pfgQzllRH4FHcFeCLMU"
                  />
                )}
              </div>
              <span className="hidden sm:inline font-label-md text-label-md text-on-surface font-semibold">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Content Slot */}
        <main className="flex-1 mt-16 p-container_padding overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
