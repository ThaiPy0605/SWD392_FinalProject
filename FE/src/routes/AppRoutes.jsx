import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import LandingLayout from '../layouts/LandingLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import CheckoutLayout from '../layouts/CheckoutLayout';
import RouteLoadBoundary from '../components/loading/RouteLoadBoundary';

import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CheckoutPage from '../pages/CheckoutPage';
import AdminPage from '../pages/AdminPage';

const AppRoutes = () => {
  const location = useLocation();
  const [catalogSearch, setCatalogSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3000000);

  const skeletonVariant = location.pathname === '/login'
    ? 'login'
    : location.pathname === '/checkout'
      ? 'checkout'
      : 'landing';

  return (
    <RouteLoadBoundary key={location.pathname} variant={skeletonVariant}>
      <Routes location={location}>
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
          path="/products/:id"
          element={
            <CheckoutLayout>
              <ProductDetailPage />
            </CheckoutLayout>
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
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminLayout searchQuery={adminSearch} setSearchQuery={setAdminSearch}>
              <AdminPage searchQuery={adminSearch} />
            </AdminLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RouteLoadBoundary>
  );
};

export default AppRoutes;
