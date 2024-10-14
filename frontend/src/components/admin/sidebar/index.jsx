import React, { useContext, useState } from "react";

import { House, User, Gear, BookOpen, List, SignOut } from "phosphor-react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../CustomHooks/authContext";
import { useNavigate } from "react-router-dom";
import "./index.css";
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse state

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page after logout
    alert("You have been logged out successfully."); // Feedback message
  };

  return (
    <div className="flex mt-3 ml-3  h-[calc(100%-1.2rem)] ">
      {/* Sidebar */}
      <div
        className={`h-3/5  bg-white text-gray-700 p-5 rounded-lg transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Toggle button */}
        <div
          className={`flex  mt-0 mb-1 ${
            isCollapsed ? "justify-center" : "justify-end"
          }`}
        >
          <button
            onClick={toggleSidebar}
            className="text-gray-300 focus:outline-none"
          >
            <List className="w-6 h-6" />
          </button>
        </div>
        <Link
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          to="/admin/dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-orange-400 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          {!isCollapsed && <span className="ml-3 text-xl">Tutoria</span>}
        </Link>
        {/* Navigation Links */}
        <nav className="mt-10 ml-1">
          <ul>
            <li className="mb-4">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-2 hover:font-semibold rounded-lg  p-2 ${
                    isActive ? "bg-orange-400 text-white" : ""
                  } ${isCollapsed ? "w-10 h-10" : "w-40 h-10"}`
                }
              >
                <House className={`h-6 w-6 font-bold`} />
                {!isCollapsed && <span>Dashboard</span>}
              </NavLink>
            </li>

            <li className="mb-4">
              <NavLink
                to="/admin/course"
                className={({ isActive }) =>
                  `flex items-center space-x-2 hover:font-semibold rounded-lg  p-2 ${
                    isActive ? "bg-orange-400 text-white" : ""
                  } ${isCollapsed ? "w-10 h-10" : "w-40 h-10"}`
                }
              >
                <BookOpen className={`h-6 w-6 font-bold`} />
                {!isCollapsed && <span>Courses</span>}
              </NavLink>
            </li>

            <li className="mb-4">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center space-x-2 hover:font-semibold rounded-lg  p-2 ${
                    isActive ? "bg-orange-400 text-white" : ""
                  } ${isCollapsed ? "w-10 h-10" : "w-40 h-10"}`
                }
              >
                <User className={`h-6 w-6 font-bold `} />
                {!isCollapsed && <span>Profile</span>}
              </NavLink>
            </li>

            <li className="mb-4">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center space-x-2 hover:font-semibold rounded-lg  p-2 ${
                    isActive ? "bg-orange-400 text-white" : ""
                  } ${isCollapsed ? "w-10 h-10" : "w-40 h-10"}`
                }
              >
                <Gear className={`h-6 w-6 font-bold `} />
                {!isCollapsed && <span>Settings</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="flex-end">
          <button
            onClick={handleLogout}
            className={`flex items-center  bg-orange-400 text-white space-x-2 hover:font-semibold rounded-lg  p-2 ${
              isCollapsed ? "w-10 h-10" : "w-40 h-10"
            } `}
          >
            <SignOut className={`h-6 w-6 font-bold `} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
