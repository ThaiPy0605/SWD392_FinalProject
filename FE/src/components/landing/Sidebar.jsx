import React from 'react';

const categories = [
  { label: 'All products', value: 'All', icon: 'grid_view' },
  { label: 'Robotics', value: 'Robotics', icon: 'precision_manufacturing' },
  { label: 'Electronics', value: 'Electronics', icon: 'developer_board' },
  { label: 'For ages 8–12', value: 'Age 8-12', icon: 'toys' },
  { label: 'For ages 13+', value: 'Age 13+', icon: 'school' },
];

const Sidebar = ({ selectedFilter, onFilterChange, maxPrice, onMaxPriceChange }) => (
  <aside className="landing-sidebar" aria-label="Catalog filters">
    <div className="landing-sidebar__heading">
      <div>
        <span className="eyebrow">Explore</span>
        <h2>Find your kit</h2>
      </div>
      <span className="material-symbols-outlined" aria-hidden="true">tune</span>
    </div>

    <div className="landing-sidebar__section">
      <p className="landing-sidebar__label">Category</p>
      <div className="landing-sidebar__options">
        {categories.map((category) => (
          <button
            type="button"
            key={category.value}
            onClick={() => onFilterChange(category.value)}
            className={`sidebar-option ${selectedFilter === category.value ? 'sidebar-option--active' : ''}`}
            aria-pressed={selectedFilter === category.value}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{category.icon}</span>
            <span>{category.label}</span>
            {selectedFilter === category.value && (
              <span className="material-symbols-outlined sidebar-option__check" aria-hidden="true">check</span>
            )}
          </button>
        ))}
      </div>
    </div>

    <div className="landing-sidebar__section">
      <div className="landing-sidebar__range-title">
        <p className="landing-sidebar__label">Maximum price</p>
        <strong>{maxPrice.toLocaleString()} ₫</strong>
      </div>
      <input
        type="range"
        min="300000"
        max="2000000"
        step="50000"
        value={maxPrice}
        onChange={(event) => onMaxPriceChange(Number(event.target.value))}
        className="price-range"
        aria-label="Maximum product price"
      />
      <div className="landing-sidebar__range-scale">
        <span>300k</span>
        <span>2m</span>
      </div>
    </div>

    <div className="sidebar-help">
      <span className="material-symbols-outlined" aria-hidden="true">support_agent</span>
      <div>
        <strong>Need a school bundle?</strong>
        <p>Our education team can help you choose.</p>
      </div>
    </div>
  </aside>
);

export default Sidebar;
