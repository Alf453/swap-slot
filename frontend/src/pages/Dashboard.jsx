import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { EVENT_STATUS } from "./enums";
import useSocket from "../hooks/useSocket";

const pageWrap = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
  padding: "2rem 1rem",
  fontFamily: "system-ui, sans-serif",
  color: "#111827",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const container = {
  width: "100%",
  maxWidth: 800,
  background: "white",
  borderRadius: 12,
  padding: "2rem",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
};

const heading = {
  fontSize: "1.8rem",
  fontWeight: 700,
  marginBottom: "1.5rem",
  textAlign: "center",
  color: "#111827",
};

const row = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

const card = {
  padding: 16,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  marginBottom: 12,
  background: "white",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const cardHover = {
  transform: "translateY(-3px)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const btn = {
  padding: "8px 12px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
  color: "white",
  fontWeight: 600,
  transition: "transform 0.2s, opacity 0.2s",
};

const btnHover = {
  transform: "translateY(-1px)",
  opacity: 0.9,
};

const input = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontSize: "1rem",
};

const inputFocus = {
  borderColor: "#3b82f6",
  boxShadow: "0 0 4px rgba(59,130,246,0.4)",
};

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [focusField, setFocusField] = useState({
    title: false,
    start: false,
    end: false,
  });
  useSocket();

  const load = async () => {
    const { data } = await API.get("/events/mine");
    setEvents(data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      startTime: new Date(form.startTime),
      endTime: new Date(form.endTime),
    };
    await API.post("/events", payload);
    setForm({ title: "", startTime: "", endTime: "" });
    load();
  };

  const makeSwappable = async (id) => {
    await API.put(`/events/${id}`, { status: EVENT_STATUS.SWAPPABLE });
    load();
  };

  return (
    <div style={pageWrap}>
      <div style={container}>
        <h2 style={heading}>My Events</h2>

        <form
          onSubmit={create}
          style={{
            ...card,
            display: "grid",
            gap: 12,
          }}
        >
          <input
            placeholder="Title"
            style={{
              ...input,
              ...(focusField.title ? inputFocus : {}),
            }}
            value={form.title}
            onFocus={() => setFocusField({ ...focusField, title: true })}
            onBlur={() => setFocusField({ ...focusField, title: false })}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="datetime-local"
            style={{
              ...input,
              ...(focusField.start ? inputFocus : {}),
            }}
            value={form.startTime}
            onFocus={() => setFocusField({ ...focusField, start: true })}
            onBlur={() => setFocusField({ ...focusField, start: false })}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
          <input
            type="datetime-local"
            style={{
              ...input,
              ...(focusField.end ? inputFocus : {}),
            }}
            value={form.endTime}
            onFocus={() => setFocusField({ ...focusField, end: true })}
            onBlur={() => setFocusField({ ...focusField, end: false })}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />
          <button
            style={{
              ...btn,
              ...(hoveredBtn ? btnHover : {}),
            }}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
          >
            Create
          </button>
        </form>

        <div style={{ marginTop: 20 }}>
          {events.map((ev) => (
            <div
              key={ev._id}
              style={{
                ...card,
                ...(hoveredCard === ev._id ? cardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(ev._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={row}>
                <strong style={{ fontSize: "1.1rem" }}>{ev.title}</strong>
                <span style={{ color: "#555", fontSize: "0.95rem" }}>
                  {new Date(ev.startTime).toLocaleString()} –{" "}
                  {new Date(ev.endTime).toLocaleString()}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 12,
                    padding: "4px 8px",
                    borderRadius: 6,
                    background:
                      ev.status === EVENT_STATUS.SWAPPABLE
                        ? "#dcfce7"
                        : "#fef9c3",
                    border: "1px solid #ddd",
                    color:
                      ev.status === EVENT_STATUS.SWAPPABLE
                        ? "#166534"
                        : "#854d0e",
                  }}
                >
                  {ev.status}
                </span>
              </div>
              {ev.status === "BUSY" && (
                <button
                  style={{
                    ...btn,
                    marginTop: 8,
                    ...(hoveredBtn ? btnHover : {}),
                  }}
                  onMouseEnter={() => setHoveredBtn(true)}
                  onMouseLeave={() => setHoveredBtn(false)}
                  onClick={() => makeSwappable(ev._id)}
                >
                  Make Swappable
                </button>
              )}
            </div>
          ))}
          {!events.length && (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                marginTop: "1rem",
              }}
            >
              No events yet. Create one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
