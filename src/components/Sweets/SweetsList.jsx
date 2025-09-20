// src/components/Sweets/SweetsList.jsx
import React, { useState, useEffect } from "react";
import "../../style/LandingPage.css";

const initialSweets = [
  { id: 1, name: "Gulab Jamun", category: "Indian", price: 50, quantity: 5, image: "https://placehold.co/150x150/d15d86/fff?text=Gulab+Jamun" },
  { id: 2, name: "Rasmalai", category: "Indian", price: 70, quantity: 0, image: "https://placehold.co/150x150/d15d86/fff?text=Rasmalai" },
  { id: 3, name: "Cheesecake", category: "Western", price: 120, quantity: 3, image: "https://placehold.co/150x150/d15d86/fff?text=Cheesecake" },
  { id: 4, name: "Cupcake", category: "Western", price: 40, quantity: 10, image: "https://placehold.co/150x150/d15d86/fff?text=Cupcake" }
];

const SweetsList = ({ isAdmin }) => {
  const [sweets, setSweets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [newSweet, setNewSweet] = useState({ name: "", category: "Indian", price: "", quantity: "", image: "" });

  useEffect(() => {
    setSweets(initialSweets);
  }, []);

  const handlePurchase = (id) => {
    const updated = sweets.map(s => s.id === id && s.quantity > 0 ? { ...s, quantity: s.quantity - 1 } : s);
    setSweets(updated);
    alert("Purchased!");
  };

  const handleAddSweet = () => {
    const sweet = { ...newSweet, id: Date.now(), price: Number(newSweet.price), quantity: Number(newSweet.quantity) };
    setSweets([sweet, ...sweets]);
    setNewSweet({ name: "", category: "Indian", price: "", quantity: "", image: "" });
  };

  const handleDelete = (id) => setSweets(sweets.filter(s => s.id !== id));

  const filtered = sweets.filter(s => {
    const categoryMatch = categoryFilter === "All" || s.category === categoryFilter;
    const stockMatch = stockFilter === "All" || (stockFilter === "In Stock" && s.quantity > 0) || (stockFilter === "Sold Out" && s.quantity === 0);
    const searchMatch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && stockMatch && searchMatch;
  });

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <input placeholder="Search sweets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option>All</option>
          <option>Indian</option>
          <option>Western</option>
        </select>
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
          <option>All</option>
          <option>In Stock</option>
          <option>Sold Out</option>
        </select>
      </div>

      {/* Admin add sweet */}
      {isAdmin && (
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input placeholder="Name" value={newSweet.name} onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} />
          <input placeholder="Image URL" value={newSweet.image} onChange={e => setNewSweet({ ...newSweet, image: e.target.value })} />
          <input placeholder="Price" type="number" value={newSweet.price} onChange={e => setNewSweet({ ...newSweet, price: e.target.value })} />
          <input placeholder="Quantity" type="number" value={newSweet.quantity} onChange={e => setNewSweet({ ...newSweet, quantity: e.target.value })} />
          <select value={newSweet.category} onChange={e => setNewSweet({ ...newSweet, category: e.target.value })}>
            <option>Indian</option>
            <option>Western</option>
          </select>
          <button onClick={handleAddSweet} style={{ backgroundColor: "#d15d86", color: "#fff", padding: "5px 10px" }}>Add</button>
        </div>
      )}

      {/* Sweets grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
        {filtered.map(s => (
          <div key={s.id} style={{ padding: "15px", borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0,0,0,0.2)", textAlign: "center", transition: "transform 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <img src={s.image} alt={s.name} style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }} />
            <h3 style={{ fontFamily: "Bokor" }}>{s.name}</h3>
            <p>Price: ₹{s.price}</p>
            <p>Available: {s.quantity}</p>
            <button onClick={() => handlePurchase(s.id)} disabled={s.quantity === 0} style={{ padding: "5px 10px", backgroundColor: s.quantity === 0 ? "gray" : "#d15d86", color: "#fff", border: "none", borderRadius: "5px", marginRight: "5px" }}>
              {s.quantity === 0 ? "Sold Out" : "Purchase"}
            </button>
            {isAdmin && <button onClick={() => handleDelete(s.id)} style={{ padding: "5px 10px", backgroundColor: "red", color: "#fff", border: "none", borderRadius: "5px" }}>Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SweetsList;

