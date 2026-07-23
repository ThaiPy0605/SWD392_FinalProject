import React from 'react';
import Header from '../components/landing/Header';
import SubNav from '../components/landing/SubNav';
import Sidebar from '../components/landing/Sidebar';
import Footer from '../components/landing/Footer';
import { useApp } from '../context/AppContext';

const LandingLayout = ({
  children,
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  maxPrice,
  setMaxPrice,
}) => {
  const { categories } = useApp();

  return (
    <div className="landing-shell">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <SubNav
        categories={categories}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <div className="landing-shell__body">
        <Sidebar
          categories={categories}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
        />
        <main className="landing-shell__content">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default LandingLayout;
