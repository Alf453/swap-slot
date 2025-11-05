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
};

const bgWrap = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
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

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState({ email: false, password: false });

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/auth/login", form);
    login(data);
  };

  return (
    <div style={bgWrap}>
      <form onSubmit={submit} style={wrap}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: 24,
            color: "#111827",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Welcome Back 👋
        </h2>

        <input
          style={{
            ...input,
            ...(focus.email ? inputFocus : {}),
          }}
          placeholder="Email"
          value={form.email}
          onFocus={() => setFocus({ ...focus, email: true })}
          onBlur={() => setFocus({ ...focus, email: false })}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          style={{
            ...input,
            ...(focus.password ? inputFocus : {}),
          }}
          type="password"
          placeholder="Password"
          value={form.password}
          onFocus={() => setFocus({ ...focus, password: true })}
          onBlur={() => setFocus({ ...focus, password: false })}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          style={{
            ...btn,
            ...(hover ? btnHover : {}),
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "#6b7280",
            fontSize: "0.9rem",
          }}
        >
          Don’t have an account?{" "}
          <a
            href="/signup"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
