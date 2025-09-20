import React from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '../components/Auth/Register';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Create a New Account</h2>
        <Register onRegisterSuccess={handleRegisterSuccess} />
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;