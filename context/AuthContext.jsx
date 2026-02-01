"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // user = { name, email, role: "user" | "admin" }

  const login = (email, password) => {
    if (email === "admin@store.com" && password === "admin123") {
      setUser({ name: "Admin User", email, role: "admin" });
      return true;
    }

    if (email && password) {
      setUser({ name: "Demo User", email, role: "user" });
      return true;
    }

    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
