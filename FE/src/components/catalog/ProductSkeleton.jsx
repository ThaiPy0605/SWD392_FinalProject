import React from 'react';

const ProductSkeleton = ({ count = 6 }) => (
  <div className="product-grid" aria-busy="true" aria-label="Loading products">
    {Array.from({ length: count }).map((_, index) => (
      <div className="product-card product-card--skeleton" key={index} aria-hidden="true">
        <div className="skeleton skeleton--image" />
        <div className="product-card__body">
          <div className="skeleton skeleton--line skeleton--line-wide" />
          <div className="skeleton skeleton--line skeleton--line-short" />
          <div className="skeleton skeleton--price" />
          <div className="skeleton skeleton--button" />
        </div>
      </div>
    ))}
  </div>
);

export default ProductSkeleton;
