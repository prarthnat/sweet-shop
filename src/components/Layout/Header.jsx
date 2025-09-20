// src/components/Layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/Header.css'; // ensure this file exists

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // adjust according to your auth setup
    navigate('/login');
  };

  return (
    <header className="header-container">
      <div className="logo">
        <img src= "/screenshots/logo.jpeg" alt="Mithai Magic Logo"className="logo-img" />
        <h1 className="logo-text">Mithai Magic</h1>
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;
