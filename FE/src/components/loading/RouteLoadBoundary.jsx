import React, { useEffect, useState } from 'react';
import PageSkeleton from './PageSkeleton';

const RouteLoadBoundary = ({ children, variant }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return isLoading ? <PageSkeleton variant={variant} /> : children;
};

export default RouteLoadBoundary;
