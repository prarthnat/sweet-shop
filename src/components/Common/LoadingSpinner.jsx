// src/components/Common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  color = 'primary',
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };

  const spinnerClass = `spinner ${sizeClasses[size]} ${colorClasses[color]}`;

  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={spinnerClass}></div>
          {message && <div className="loading-message">{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={spinnerClass}></div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  );
};

// Inline Loading Component for buttons
export const InlineSpinner = ({ size = 'small', color = 'white' }) => {
  const sizeClasses = {
    small: 'spinner-inline-small',
    medium: 'spinner-inline-medium'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };

  return (
    <div className={`spinner-inline ${sizeClasses[size]} ${colorClasses[color]}`}></div>
  );
};

// Skeleton Loading Component
export const SkeletonLoader = ({ rows = 3, height = '1rem' }) => {
  return (
    <div className="skeleton-container">
      {Array.from({ length: rows }, (_, index) => (
        <div 
          key={index}
          className="skeleton-row"
          style={{ height, marginBottom: '0.5rem' }}
        ></div>
      ))}
    </div>
  );
};

// Card Skeleton for Sweet Cards
export const SweetCardSkeleton = ({ count = 6 }) => {
  return (
    <div className="sweets-grid">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="sweet-card skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-category"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;