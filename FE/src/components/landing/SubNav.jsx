import React from 'react';

const categoryIcon = (name) => {
  if (name === 'Robotics') return 'precision_manufacturing';
  if (name === 'Electronics') return 'memory';
  if (name === 'STEM Kits') return 'science';
  return 'category';
};

const SubNav = ({ categories, selectedFilter, onFilterChange }) => {
  const availableCategories = categories || [];
  const items = [
    { label: 'All kits', value: 'All', icon: 'apps' },
    ...availableCategories.slice(0, 5).map((category) => ({
      label: category.name,
      value: category.name,
      icon: categoryIcon(category.name),
    })),
  ];

  return (
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
};

export default SubNav;
