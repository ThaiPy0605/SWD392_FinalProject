import React from 'react';

const items = [
  { label: 'All kits', value: 'All', icon: 'apps' },
  { label: 'Robotics', value: 'Robotics', icon: 'precision_manufacturing' },
  { label: 'Electronics', value: 'Electronics', icon: 'memory' },
  { label: 'Age 8–12', value: 'Age 8-12', icon: 'toys' },
  { label: 'Age 13+', value: 'Age 13+', icon: 'school' },
];

const SubNav = ({ selectedFilter, onFilterChange }) => (
  <div className="landing-subnav">
    <nav className="landing-subnav__inner" aria-label="Product categories">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`subnav-item ${selectedFilter === item.value ? 'subnav-item--active' : ''}`}
          onClick={() => onFilterChange(item.value)}
          aria-pressed={selectedFilter === item.value}
        >
          <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <span className="subnav-note">
        <span className="material-symbols-outlined" aria-hidden="true">local_shipping</span>
        Free delivery from 1,500,000 ₫
      </span>
    </nav>
  </div>
);

export default SubNav;
