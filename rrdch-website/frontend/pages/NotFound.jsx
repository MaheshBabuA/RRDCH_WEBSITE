import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page not-found-page" style={{ textAlign: 'center', padding: '3rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
