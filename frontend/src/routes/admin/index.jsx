import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../CustomHooks/authContext";

const AdminRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/dashboard" />; // Redirect to employee dashboard if not an admin
  }
  // if (!isLoggedIn || role !== "admin") {
  //   return <Navigate to="/login" />;
  // }

  return children;
};

export default AdminRoute;
