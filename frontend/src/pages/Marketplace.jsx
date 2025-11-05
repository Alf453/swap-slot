import React, { useEffect, useState } from "react";
import API from "../api/axios";

const pageWrap = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
  padding: "2rem 1rem",
  fontFamily: "system-ui, sans-serif",
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

const selectStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "1rem",
  background: "#fff",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const selectFocus = {
  borderColor: "#3b82f6",
  boxShadow: "0 0 4px rgba(59,130,246,0.4)",
};

export default function Marketplace() {
  const [list, setList] = useState([]);
  const [my, setMy] = useState([]);
  const [offer, setOffer] = useState("");
  const [openFor, setOpenFor] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [focusSelect, setFocusSelect] = useState(false);

  const load = async () => {
    const a = await API.get("/events/swappable");
    const b = await API.get("/events/mine");
    setList(a.data);
    setMy(b.data.filter((e) => e.status === "SWAPPABLE"));
  };

  useEffect(() => {
    load();
  }, []);

  const requestSwap = async () => {
    await API.post("/swaps/request", { mySlotId: offer, theirSlotId: openFor });
    setOffer("");
    setOpenFor(null);
    alert("Requested!");
  };

  return (
    <div style={pageWrap}>
      <div style={container}>
        <h2 style={heading}>Marketplace – Swappable Slots</h2>

        {list.map((ev) => (
          <div
            key={ev._id}
            style={{
              ...card,
              ...(hoveredCard === ev._id ? cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard(ev._id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 4 }}
            >
              {ev.title}{" "}
              <span style={{ color: "#6b7280", fontWeight: 400 }}>
                {ev.owner?.name ? `by ${ev.owner.name}` : ""}
              </span>
            </div>
            <div style={{ color: "#555", fontSize: "0.95rem" }}>
              {new Date(ev.startTime).toLocaleString()} –{" "}
              {new Date(ev.endTime).toLocaleString()}
            </div>
            <button
              style={{
                ...btn,
                marginTop: 10,
                ...(hoveredBtn ? btnHover : {}),
              }}
              onMouseEnter={() => setHoveredBtn(true)}
              onMouseLeave={() => setHoveredBtn(false)}
              onClick={() => setOpenFor(ev._id)}
            >
              Request Swap
            </button>
          </div>
        ))}

        {openFor && (
          <div
            style={{
              ...card,
              background: "#f9fafb",
              border: "1px solid #d1d5db",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                marginBottom: 8,
                color: "#111827",
              }}
            >
              Select one of your SWAPPABLE slots to offer
            </h3>
            <select
              style={{
                ...selectStyle,
                ...(focusSelect ? selectFocus : {}),
              }}
              value={offer}
              onFocus={() => setFocusSelect(true)}
              onBlur={() => setFocusSelect(false)}
              onChange={(e) => setOffer(e.target.value)}
            >
              <option value="">Choose…</option>
              {my.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title} ({new Date(m.startTime).toLocaleString()})
                </option>
              ))}
            </select>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 12,
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  ...btn,
                  background:
                    offer === ""
                      ? "gray"
                      : "linear-gradient(90deg, #3b82f6, #06b6d4)",
                  opacity: offer === "" ? 0.7 : 1,
                  cursor: offer === "" ? "not-allowed" : "pointer",
                }}
                disabled={!offer}
                onClick={requestSwap}
              >
                Confirm
              </button>
              <button
                style={{
                  ...btn,
                  background: "linear-gradient(90deg, #ef4444, #f87171)",
                }}
                onClick={() => {
                  setOpenFor(null);
                  setOffer("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!list.length && (
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginTop: "1rem",
            }}
          >
            No swappable events available at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
