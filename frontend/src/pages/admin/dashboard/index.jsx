import React, { useContext } from "react";
import Sidebar from "../../../components/admin/sidebar";
import { AuthContext } from "../../../CustomHooks/authContext";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page after logout
    alert("You have been logged out successfully."); // Feedback message
  };
  return (
    <div className="bg-white mt-4 ml-4 rounded-lg h-[calc(100%-2rem)]"> hi</div>
  );
};

export default Dashboard;
