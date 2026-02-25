import React from 'react';

const AuthBanner = ({ image, title, description }) => {
  return (
    <div className="auth-banner">
      <div className="banner-content">
        <img src={image} alt="Auth Illustration" className="banner-img" />
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>{title}</h1>
        <p style={{ fontSize: '16px', lineHeight: 1.6, opacity: 0.9 }}>{description}</p>
      </div>
    </div>
  );
};

export default AuthBanner;