import React, { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const wrap = {
  maxWidth: 420,
  margin: "5rem auto",
  padding: "2rem",
  borderRadius: 12,
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  background: "white",
  position: "relative",
  zIndex: 1,
  animation: "fadeIn 0.6s ease",
};

const bgWrap = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  fontFamily: "system-ui, sans-serif",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  outline: "none",
  fontSize: "1rem",
  transition: "0.3s border, 0.3s box-shadow",
};

const inputFocus = {
  borderColor: "#3b82f6",
  boxShadow: "0 0 4px rgba(59,130,246,0.5)",
};

const btn = {
  width: "100%",
  padding: "12px",
  border: 0,
  borderRadius: 8,
  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "1rem",
  transition: "0.3s background, 0.3s transform",
};

const btnHover = {
  transform: "translateY(-1px)",
  background: "linear-gradient(90deg, #2563eb, #0891b2)",
};

export default function Signup() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await API.post("/auth/signup", form);
    setTimeout(() => {
      login(data);
      setLoading(false);
    }, 600); // small delay for animation
  };

  return (
    <div style={bgWrap}>
      <form onSubmit={submit} style={wrap}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: 24,
            color: "#111827",
            animation: "fadeInDown 0.8s ease",
          }}
        >
          Create Your Account ✨
        </h2>

        <input
          style={{ ...input, ...(focus.name ? inputFocus : {}) }}
          placeholder="Name"
          value={form.name}
          onFocus={() => setFocus({ ...focus, name: true })}
          onBlur={() => setFocus({ ...focus, name: false })}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          style={{ ...input, ...(focus.email ? inputFocus : {}) }}
          placeholder="Email"
          value={form.email}
          onFocus={() => setFocus({ ...focus, email: true })}
          onBlur={() => setFocus({ ...focus, email: false })}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          style={{ ...input, ...(focus.password ? inputFocus : {}) }}
          type="password"
          placeholder="Password"
          value={form.password}
          onFocus={() => setFocus({ ...focus, password: true })}
          onBlur={() => setFocus({ ...focus, password: false })}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          style={{ ...btn, ...(hover ? btnHover : {}) }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "#6b7280",
            fontSize: "0.9rem",
          }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: "#2563eb", textDecoration: "none" }}>
            Login
          </a>
        </p>
      </form>

      {/* ✨ Keyframes for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
