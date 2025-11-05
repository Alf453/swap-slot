import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Notifications from "./pages/Notifications";

const container = {
  fontFamily: "Inter, system-ui, Arial",
  maxWidth: 960,
  margin: "0 auto",
  padding: 16,
};

const footerStyle = {
  textAlign: "center",
  marginTop: 40,
  padding: "12px 0",
  fontSize: "0.9rem",
  color: "#555",
  borderTop: "1px solid #e5e7eb",
  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
  color: "white",
  borderRadius: "8px",
  fontWeight: 500,
};

export default function App() {
  return (
    <div style={container}>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* 🌟 Footer Section */}
      <footer style={footerStyle}>
        © {new Date().getFullYear()} Alfaraz Alam. All rights reserved.
      </footer>
    </div>
  );
}
