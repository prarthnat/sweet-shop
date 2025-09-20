// src/pages/Dashboard.jsx
import React, { useState } from "react";
import "../style/Dashboard.css";

const Dashboard = ({ isAdmin }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [sweets, setSweets] = useState([
    { id: 1, name: "Cupcake", status: "in-stock", image: "/screenshots/Unknown.jpg" },
    { id: 2, name: "Gulab Jamun", status: "sold-out", image: "/screenshots/gulab-jamun.jpg" },
    { id: 3, name: "Rasmalai", status: "in-stock", image: "/screenshots/rasmalai.jpg" },
    { id: 4, name: "Cheesecake", status: "in-stock", image: "/screenshots/cake.jpg" },
  ]);

  const filteredSweets = sweets.filter((sweet) => {
    return (
      sweet.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || sweet.status === filter)
    );
  });

  const handlePurchase = (id, e) => {
    const btn = e.target;
    btn.style.backgroundColor = "#d15d86"; // pink temporarily
    btn.style.color = "#fff";
    alert("Purchased!");
    setTimeout(() => {
      btn.style.backgroundColor = ""; // reset
      btn.style.color = "";
    }, 500);
  };

  const handleEditSweet = (id) => {
    const newName = prompt("Enter new sweet name:");
    if (newName) {
      setSweets((prev) =>
        prev.map((sweet) => (sweet.id === id ? { ...sweet, name: newName } : sweet))
      );
    }
  };

  const handleAddSweet = () => {
    const name = prompt("Enter sweet name:");
    const status = prompt("Enter status (in-stock / sold-out):");
    const image = prompt("Enter image path (e.g., /screenshots/cupcake.jpg):");
    if (name && status && image) {
      setSweets((prev) => [
        ...prev,
        { id: prev.length + 1, name, status, image },
      ]);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Made with Love</h2>

      {/* Search & Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All</option>
          <option value="in-stock">In Stock</option>
          <option value="sold-out">Sold Out</option>
        </select>
      </div>

      {/* Sweet Cards */}
      <div className="sweet-grid">
        {filteredSweets.map((sweet) => (
          <div key={sweet.id} className="sweet-card">
            <img src={sweet.image} alt={sweet.name} />
            <h3>{sweet.name}</h3>
            <p className={sweet.status === "sold-out" ? "sold-out" : "in-stock"}>
              {sweet.status === "sold-out" ? "Sold Out" : "In Stock"}
            </p>

            {sweet.status === "in-stock" && (
              <button onClick={(e) => handlePurchase(sweet.id, e)}>
                Purchase
              </button>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <div className="admin-controls">
                <button
                  className="edit-btn"
                  onClick={() => handleEditSweet(sweet.id)}
                >
                  ✏️ Edit
                </button>
                <button className="add-btn" onClick={handleAddSweet}>
                  ➕ Add
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
