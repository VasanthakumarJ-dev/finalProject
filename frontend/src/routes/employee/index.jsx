import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../CustomHooks/authContext";

const EmployeeRoute = ({ children }) => {
  const { isLoggedIn, role } = useContext(AuthContext);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role !== "employee") {
    return <Navigate to="/admin/dashboard" />; // Redirect to admin dashboard if not an employee
  }

  //   const { isLoggedIn, role } = useContext(AuthContext);

  //   if (!isLoggedIn || role !== "admin") {
  //     return <Navigate to="/login" />;
  //   }
  return children;
};

export default EmployeeRoute;
