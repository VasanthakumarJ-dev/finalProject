import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Corrected the import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("employee");
  const [token, setToken] = useState(null); // Added token state
  const [name, setName] = useState(""); // Added name state

  const checkToken = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
          setRole(decodedToken.role);
          setName(decodedToken.name);
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
    const decodedToken = jwtDecode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("role", backendRole);
    setToken(token); // Store the token
    setIsLoggedIn(true);
    setRole(backendRole);
    setName(decodedToken.name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole("user");
    setName("");
    setToken(null); // Clear the token
    localStorage.removeItem("token");
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, token, name, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
