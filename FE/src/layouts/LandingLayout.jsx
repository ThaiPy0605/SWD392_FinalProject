import React from 'react';
import Header from '../components/landing/Header';
import SubNav from '../components/landing/SubNav';
import Sidebar from '../components/landing/Sidebar';
import Footer from '../components/landing/Footer';

const LandingLayout = ({
  children,
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  maxPrice,
  setMaxPrice,
}) => (
  <div className="landing-shell">
    <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    <SubNav selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
    <div className="landing-shell__body">
      <Sidebar
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

export default LandingLayout;
