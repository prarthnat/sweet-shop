// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email, role: 'user'/'admin' }
  const [error, setError] = useState("");

  const login = ({ email, password }) => {
    // For demo, we just check localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    } else {
      setError("Invalid credentials");
      return { success: false };
    }
  };

  const register = ({ name, email, password, role }) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some(u => u.email === email)) {
      setError("Email already exists");
      return { success: false };
    }
    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, error, setError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for convenience
export const useAuth = () => useContext(AuthContext);
