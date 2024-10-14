import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../CustomHooks/authContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default to employee
  const [errorMessage, setErrorMessage] = useState(""); // For handling errors
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login...");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );
      const { token, role: backendRole } = response.data;
      console.log(backendRole);
      // Check if the selected role matches the role from the backend
      if (role !== backendRole) {
        setErrorMessage(`You don't have access to the ${role} role.`);
        return; // Prevent further navigation
      }

      // If roles match, proceed with login
      localStorage.setItem("token", token);
      login(token, backendRole);

      // Navigate based on role
      if (backendRole === "admin") {
        console.log("im in ");
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

      console.log("Login successful:", response.data);
    } catch (error) {
      // Handle error response for login issues
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:m-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Login
          </h2>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded border border-gray-300 focus:bg-orange-500 focus:ring-2 focus:ring-orange-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white rounded border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="role" className="leading-7 text-sm text-gray-600">
              Select Role:
            </label>
            <select
              id="role"
              name="role"
              className="w-full bg-white border border-gray-300 rounded py-2 px-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base outline-none text-gray-700 leading-8 transition-colors duration-200 ease-in-out"
              value={role}
              onChange={(e) => setRole(e.target.value)} // Update role based on user's selection
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Error message display */}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <button
            onClick={handleLogin}
            className="text-white bg-orange-500 border-0 py-2 px-8 focus:outline-none hover:bg-orange-600 rounded text-lg"
          >
            Login
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Click here to retain password if forgotten
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
