// src/components/Sweets/AddSweet.jsx
import React, { useState } from 'react';

const AddSweet = ({ onCancel, onSave }) => {
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: 0, image: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, price: Number(form.price) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-inner card" style={{ padding: 16 }}>
        <h3>Add New Sweet</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Name</label><input name="name" value={form.name} onChange={handleChange} required className="form-input" /></div>
          <div className="form-group"><label>Description</label><input name="description" value={form.description} onChange={handleChange} className="form-input" /></div>
          <div className="form-group"><label>Price (€)</label><input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" className="form-input" /></div>
          <div className="form-group"><label>Quantity</label><input name="quantity" value={form.quantity} onChange={handleChange} type="number" className="form-input" /></div>
          <div className="form-group"><label>Image URL</label><input name="image" value={form.image} onChange={handleChange} className="form-input" /></div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="button" type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSweet;
