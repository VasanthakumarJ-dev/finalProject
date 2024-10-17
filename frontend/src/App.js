import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard2";

import AdminDashboard from "./pages/admin/dashboard";

import "./App.css";
import PublicLayout from "./layout/public";
import PrivateLayout from "./layout/private";
import AdminLayout from "./layout/admin";

import AdminRoute from "./routes/admin";
import Course from "./pages/admin/courseManagement";

import CourseDetail from "./pages/CourseDetail";
import { AuthContext, AuthProvider } from "./CustomHooks/authContext";
function App() {
  const { isLoggedIn } = useContext(AuthContext);
  const role = localStorage.getItem("role");
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <PublicLayout>
                <Login />
              </PublicLayout>
            ) : (
              role === "admin"? 
              (<Navigate to="/admin/dashboard" />):(<Navigate to="/dashboard" />)
              
            )
          }
        />
        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              <PublicLayout>
                <Register />
              </PublicLayout>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* Private Routes with PrivateLayout */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <PrivateLayout>
                <Dashboard2 />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/course"
          element={
            isLoggedIn ? (
              <PrivateLayout>
                <Courses />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/courses/:id"
          element={
            isLoggedIn ? (
              <PrivateLayout>
                <CourseDetail />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* admin routes */}
        {/* <Route path="/admin/login" element={<Adminlogin />} /> */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />
        {/* <Route
          path="/admin/addcourse"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddCourse/>
              </AdminLayout>
            </AdminRoute>
          }
        /> */}
        <Route
          path="/admin/course"
          element={
            <AdminRoute>
              <AdminLayout>
                <Course />
              </AdminLayout>
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function AppWithProvider() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
