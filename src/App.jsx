// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import LandingPage from './pages/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './style/LandingPage.css';
import './style/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login and Register routes - no header */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes - header visible after login */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Header /> {/* Only after login */}
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
