import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Corrected the import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("employee");
  const [token, setToken] = useState(null); // Added token state

  const checkToken = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
          setRole(decodedToken.role);
          setToken(storedToken); // Store the token
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  };

  const login = (token, backendRole) => {
    localStorage.setItem("token", token);
    setToken(token); // Store the token
    setIsLoggedIn(true);
    setRole(backendRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole("user");
    setToken(null); // Clear the token
    localStorage.removeItem("token");
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
