import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer" style={{ padding: '2rem', background: '#333', color: '#fff', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} Rajarajeswari Dental College & Hospital. All rights reserved.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
