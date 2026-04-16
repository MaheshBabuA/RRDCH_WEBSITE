import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

/**
 * PageWrapper (Index)
 * 
 * Provides the core layout structure (Navigation & Footer) and 
 * wraps the dynamic routes (Outlet). Applies a subtle fade-in
 * animation on route change.
 */
const PageWrapper = () => {
  const location = useLocation();

  return (
    <Layout>
      {/* 
        Using location.pathname as a key forces React to unmount and remount 
        the div on route changes, triggering the 'animate-fade-in' animation 
      */}
      <div key={location.pathname} className="w-full animate-fade-in">
        <Outlet />
      </div>
    </Layout>
  );
};

export default PageWrapper;
