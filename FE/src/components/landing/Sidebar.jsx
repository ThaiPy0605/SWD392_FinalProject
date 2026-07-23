import React from 'react';

const fallbackCategories = [
  { name: 'Robotics' },
  { name: 'Electronics' },
  { name: 'STEM Kits' },
];

const categoryIcon = (name) => {
  if (name === 'Robotics') return 'precision_manufacturing';
  if (name === 'Electronics') return 'developer_board';
  if (name === 'STEM Kits') return 'science';
  return 'category';
};

const Sidebar = ({
  categories,
  selectedFilter,
  onFilterChange,
  maxPrice,
  onMaxPriceChange,
}) => {
  const availableCategories = categories?.length ? categories : fallbackCategories;
  const options = [
    { label: 'All products', value: 'All', icon: 'grid_view' },
    ...availableCategories.map((category) => ({
      label: category.name,
      value: category.name,
      icon: categoryIcon(category.name),
    })),
  ];

  return (
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
          {options.map((category) => (
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
          max="3000000"
          step="50000"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
          className="price-range"
          aria-label="Maximum product price"
        />
        <div className="landing-sidebar__range-scale">
          <span>300k</span>
          <span>3m</span>
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
};

export default Sidebar;
