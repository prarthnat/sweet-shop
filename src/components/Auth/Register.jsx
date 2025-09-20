// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../style/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', isAdmin: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await register(formData);
      if (res.success) navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <label>
          <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} /> Register as Admin
        </label>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
};

export default Register;
