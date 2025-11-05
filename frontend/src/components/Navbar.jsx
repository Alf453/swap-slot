import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const bar = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "12px 24px",
  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
  borderBottom: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  color: "white",
  position: "sticky",
  top: 0,
  zIndex: 50,
};

const brand = {
  fontWeight: 800,
  fontSize: 20,
  letterSpacing: 0.5,
  cursor: "pointer",
  color: "white",
  textDecoration: "none",
};

const spacer = { flex: 1 };

const linkStyle = {
  textDecoration: "none",
  color: "white",
  fontWeight: 500,
  padding: "6px 10px",
  borderRadius: 8,
  transition: "all 0.3s ease",
};

const btn = {
  padding: "6px 12px",
  border: "1px solid rgba(255,255,255,0.6)",
  borderRadius: 8,
  cursor: "pointer",
  background: "rgba(255,255,255,0.2)",
  color: "white",
  fontWeight: 600,
  transition: "0.3s background, 0.3s transform",
};

const btnHover = {
  background: "rgba(255,255,255,0.35)",
  transform: "translateY(-1px)",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const [btnHovering, setBtnHovering] = useState(false);

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/notifications", label: "Notifications" },
  ];

  return (
    <nav style={bar}>
      <Link to="/" style={brand}>
        SlotSwapper
      </Link>

      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          style={{
            ...linkStyle,
            background:
              location.pathname === link.to
                ? "rgba(255,255,255,0.25)"
                : hovered === link.to
                ? "rgba(255,255,255,0.15)"
                : "transparent",
          }}
          onMouseEnter={() => setHovered(link.to)}
          onMouseLeave={() => setHovered(null)}
        >
          {link.label}
        </Link>
      ))}

      <div style={spacer} />

      {user ? (
        <>
          <span style={{ color: "white", fontWeight: 500 }}>
            Hi, {user.name}
          </span>
          <button
            style={{
              ...btn,
              ...(btnHovering ? btnHover : {}),
            }}
            onMouseEnter={() => setBtnHovering(true)}
            onMouseLeave={() => setBtnHovering(false)}
            onClick={logout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            style={{
              ...linkStyle,
              background:
                hovered === "login" ? "rgba(255,255,255,0.15)" : "transparent",
            }}
            onMouseEnter={() => setHovered("login")}
            onMouseLeave={() => setHovered(null)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            style={{
              ...linkStyle,
              background:
                hovered === "signup" ? "rgba(255,255,255,0.15)" : "transparent",
            }}
            onMouseEnter={() => setHovered("signup")}
            onMouseLeave={() => setHovered(null)}
          >
            Signup
          </Link>
        </>
      )}
    </nav>
  );
}
