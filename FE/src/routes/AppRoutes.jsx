import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
import LandingLayout from '../layouts/LandingLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import CheckoutLayout from '../layouts/CheckoutLayout';
import RouteLoadBoundary from '../components/loading/RouteLoadBoundary';

// Pages
import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';
import AdminPage from '../pages/AdminPage';

const AppRoutes = () => {
  const location = useLocation();
  const [catalogSearch, setCatalogSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000000);

  const skeletonVariant = location.pathname === '/login'
    ? 'login'
    : location.pathname === '/checkout'
      ? 'checkout'
      : 'landing';

  return (
    <RouteLoadBoundary key={location.pathname} variant={skeletonVariant}>
      <Routes location={location}>
        {/* Client Facing Storefront Routes */}
        <Route
          path="/"
          element={
            <LandingLayout
              searchQuery={catalogSearch}
              setSearchQuery={setCatalogSearch}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            >
              <ProductPage
                searchQuery={catalogSearch}
                selectedFilter={selectedFilter}
                maxPrice={maxPrice}
              />
            </LandingLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutLayout>
              <CheckoutPage />
            </CheckoutLayout>
          }
        />

        {/* Authentication Route */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            <AdminLayout searchQuery={adminSearch} setSearchQuery={setAdminSearch}>
              <AdminPage searchQuery={adminSearch} />
            </AdminLayout>
          }
        />

        {/* Fallback Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RouteLoadBoundary>
  );
};

export default AppRoutes;
