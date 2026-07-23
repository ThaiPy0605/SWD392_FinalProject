import React from 'react';

const LandingSkeleton = () => (
  <div className="page-skeleton page-skeleton--landing">
    <div className="page-skeleton__header">
      <div className="skeleton skeleton-logo" />
      <div className="skeleton skeleton-search" />
      <div className="page-skeleton__actions">
        <div className="skeleton skeleton-icon" />
        <div className="skeleton skeleton-icon" />
        <div className="skeleton skeleton-account" />
      </div>
    </div>
    <div className="page-skeleton__subnav">
      {Array.from({ length: 5 }).map((_, index) => <div className="skeleton" key={index} />)}
    </div>
    <div className="page-skeleton__landing-body">
      <div className="skeleton page-skeleton__sidebar" />
      <div>
        <div className="skeleton page-skeleton__hero" />
        <div className="page-skeleton__title-row">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
        <div className="page-skeleton__cards">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="page-skeleton__card" key={index}>
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LoginSkeleton = () => (
  <div className="page-skeleton page-skeleton--login">
    <div className="page-skeleton__login-story">
      <div className="skeleton skeleton-login-brand" />
      <div className="skeleton skeleton-login-title" />
      <div className="skeleton skeleton-login-copy" />
    </div>
    <div className="page-skeleton__login-form">
      <div className="skeleton skeleton-form-title" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-submit" />
      <div className="page-skeleton__social-row">
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    </div>
  </div>
);

const CheckoutSkeleton = () => (
  <div className="page-skeleton page-skeleton--checkout">
    <div className="page-skeleton__header">
      <div className="skeleton skeleton-logo" />
      <div />
      <div className="page-skeleton__actions">
        <div className="skeleton skeleton-icon" />
        <div className="skeleton skeleton-account" />
      </div>
    </div>
    <div className="page-skeleton__checkout-title">
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
    <div className="page-skeleton__checkout-body">
      <div>
        <div className="skeleton skeleton-checkout-card" />
        <div className="skeleton skeleton-checkout-card skeleton-checkout-card--small" />
      </div>
      <div className="skeleton skeleton-checkout-summary" />
    </div>
  </div>
);

const PageSkeleton = ({ variant = 'landing' }) => {
  const content = variant === 'login'
    ? <LoginSkeleton />
    : variant === 'checkout'
      ? <CheckoutSkeleton />
      : <LandingSkeleton />;

  return (
    <div aria-busy="true" aria-label="Loading page content" role="status">
      <span className="sr-only">Loading page content…</span>
      {content}
    </div>
  );
};

export default PageSkeleton;
