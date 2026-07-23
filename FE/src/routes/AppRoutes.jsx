import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';
import CheckoutPage from '../pages/CheckoutPage';
import AdminPage from '../pages/AdminPage';

const AppRoutes = () => {
  const [catalogSearch, setCatalogSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');

  return (
    <Routes>
      {/* Client Facing Storefront Routes */}
      <Route 
        path="/" 
        element={
          <MainLayout searchQuery={catalogSearch} setSearchQuery={setCatalogSearch}>
            <ProductPage searchQuery={catalogSearch} />
          </MainLayout>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <MainLayout>
            <CheckoutPage />
          </MainLayout>
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
  );
};

export default AppRoutes;
