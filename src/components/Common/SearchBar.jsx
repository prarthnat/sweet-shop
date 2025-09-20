// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch, onClear }) => {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create search params, excluding empty values
    const searchParams = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].toString().trim()) {
        searchParams[key] = filters[key];
      }
    });
    
    onSearch(searchParams);
  };

  const handleClear = () => {
    setFilters({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    onClear();
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input">
          <label className="form-label">Search by Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter sweet name..."
            value={filters.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="search-input">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            <option value="chocolate">Chocolate</option>
            <option value="gummy">Gummy</option>
            <option value="hard candy">Hard Candy</option>
            <option value="lollipop">Lollipop</option>
            <option value="caramel">Caramel</option>
            <option value="marshmallow">Marshmallow</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="search-input">
          <label className="form-label">Min Price ($)</label>
          <input
            type="number"
            name="minPrice"
            className="form-input"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>
        
        <div className="search-input">
          <label className="form-label">Max Price ($)</label>
          <input
            type="number"
            name="maxPrice"
            className="form-input"
            placeholder="100.00"
            min="0"
            step="0.01"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
          <button type="submit" className="btn btn-primary">
            🔍 Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;