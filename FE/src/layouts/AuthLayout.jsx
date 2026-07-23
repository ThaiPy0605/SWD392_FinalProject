import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {children}
    </div>
  );
};

export default AuthLayout;
