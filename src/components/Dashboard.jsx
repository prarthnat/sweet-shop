// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../style/Dashboard.css';
import cupcakeImg from '../screenshots/Unknown.jpg';
import gulabJamunImg from '../screenshots/gulab jamun.jpg';
import rasmalaiImg from '../screenshots/rasmalai.jpg';
import cheesecakeImg from '../screenshots/cake.jpg';

const dummySweets = [
  { id: 1, name: 'Gulab Jamun', quantity: 5, image: gulabJamunImg },
  { id: 2, name: 'Rasmalai', quantity: 0, image: rasmalaiImg },
  { id: 3, name: 'Cheesecake', quantity: 3, image: cheesecakeImg },
  { id: 4, name: 'Cupcake', quantity: 10, image: cupcakeImg },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setSweets(dummySweets);
  }, []);

  const filteredSweets = sweets.filter(s => {
    if (filter === 'inStock') return s.quantity > 0;
    if (filter === 'soldOut') return s.quantity === 0;
    return true;
  });

  const handlePurchase = id => {
    const btn = document.getElementById(`purchase-btn-${id}`);
    if (btn) {
      btn.style.backgroundColor = '#d15d86'; // temporary pink
      btn.style.color = '#fff';
      alert('Purchased!');
      setTimeout(() => {
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 500); // reset after 0.5s
    }
    setSweets(prev =>
      prev.map(s => (s.id === id ? { ...s, quantity: Math.max(s.quantity - 1, 0) } : s))
    );
  };

  const handleAddSweet = () => {
    const name = prompt('Sweet Name:');
    const qty = parseInt(prompt('Quantity:'), 10);
    const img = prompt('Image URL:');
    if (name && !isNaN(qty)) setSweets(prev => [...prev, { id: prev.length + 1, name, quantity: qty, image: img }]);
  };

  const handleEditSweet = sweet => {
    const name = prompt('Sweet Name:', sweet.name);
    const qty = parseInt(prompt('Quantity:', sweet.quantity), 10);
    const img = prompt('Image URL:', sweet.image);
    if (name && !isNaN(qty)) setSweets(prev => prev.map(s => s.id === sweet.id ? { ...s, name, quantity: qty, image: img } : s));
  };

  const handleDeleteSweet = id => {
    if (window.confirm('Are you sure?')) setSweets(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      {/* Admin Add */}
      {user?.isAdmin && <button className="btn-add" onClick={handleAddSweet}>Add Sweet</button>}

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('inStock')} className={filter === 'inStock' ? 'active' : ''}>In Stock</button>
        <button onClick={() => setFilter('soldOut')} className={filter === 'soldOut' ? 'active' : ''}>Sold Out</button>
      </div>

      <div className="sweet-grid">
        {filteredSweets.map(s => (
          <div key={s.id} className="sweet-card">
            <img src={s.image} alt={s.name} />
            <h3>{s.name}</h3>
            <p>Quantity: {s.quantity}</p>
            <button
              id={`purchase-btn-${s.id}`}
              disabled={s.quantity === 0}
              onClick={() => handlePurchase(s.id)}
            >
              Purchase
            </button>

            {/* Admin controls */}
            {user?.isAdmin && (
              <div className="admin-controls">
                <button onClick={() => handleEditSweet(s)}>Edit</button>
                <button onClick={() => handleDeleteSweet(s.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
