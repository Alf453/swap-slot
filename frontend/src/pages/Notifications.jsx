import React, { useEffect, useState } from "react";
import API from "../api/axios";
import useSocket from "../hooks/useSocket";

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

const subHeading = {
  fontSize: "1.2rem",
  fontWeight: 600,
  color: "#111827",
  margin: "1.5rem 0 1rem 0",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: "6px",
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

const rejectBtn = {
  ...btn,
  background: "linear-gradient(90deg, #ef4444, #f87171)",
};

export default function Notifications() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const sock = useSocket();

  const load = async () => {
    const { data } = await API.get("/swaps/mine");
    setIncoming(data.incoming);
    setOutgoing(data.outgoing);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!sock) return;
    const refresh = () => load();
    sock.on("swap:incoming", refresh);
    sock.on("swap:accepted", refresh);
    sock.on("swap:rejected", refresh);
    return () => {
      sock.off("swap:incoming", refresh);
      sock.off("swap:accepted", refresh);
      sock.off("swap:rejected", refresh);
    };
  }, [sock]);

  const respond = async (id, accept) => {
    await API.post(`/swaps/response/${id}`, { accept });
    load();
  };

  return (
    <div style={pageWrap}>
      <div style={container}>
        <h2 style={heading}>Notifications & Requests</h2>

        <h3 style={subHeading}>Incoming</h3>
        {incoming.length > 0 ? (
          incoming.map((s) => (
            <div
              key={s._id}
              style={{
                ...card,
                ...(hoveredCard === s._id ? cardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(s._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ fontSize: "1rem", color: "#111827" }}>
                Offer: Their{" "}
                <strong style={{ color: "#3b82f6" }}>
                  "{s.mySlot?.title}"
                </strong>{" "}
                for your{" "}
                <strong style={{ color: "#06b6d4" }}>
                  "{s.theirSlot?.title}"
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 12,
                  justifyContent: "flex-end",
                }}
              >
                {s.status === "PENDING" ? (
                  <>
                    <button
                      style={{
                        ...btn,
                        ...(hoveredBtn === `accept-${s._id}` ? btnHover : {}),
                      }}
                      onMouseEnter={() => setHoveredBtn(`accept-${s._id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      onClick={() => respond(s._id, true)}
                    >
                      Accept
                    </button>
                    <button
                      style={{
                        ...rejectBtn,
                        ...(hoveredBtn === `reject-${s._id}` ? btnHover : {}),
                      }}
                      onMouseEnter={() => setHoveredBtn(`reject-${s._id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      onClick={() => respond(s._id, false)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    style={{
                      background:
                        s.status === "ACCEPTED"
                          ? "#dcfce7"
                          : s.status === "REJECTED"
                          ? "#fee2e2"
                          : "#fef9c3",
                      color:
                        s.status === "ACCEPTED"
                          ? "#166534"
                          : s.status === "REJECTED"
                          ? "#991b1b"
                          : "#854d0e",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      padding: "4px 10px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  >
                    Status: {s.status}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginTop: "0.5rem",
            }}
          >
            No incoming swap requests.
          </p>
        )}

        <h3 style={subHeading}>Outgoing</h3>
        {outgoing.length > 0 ? (
          outgoing.map((s) => (
            <div
              key={s._id}
              style={{
                ...card,
                ...(hoveredCard === `out-${s._id}` ? cardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(`out-${s._id}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ fontSize: "1rem", color: "#111827" }}>
                You offered your{" "}
                <strong style={{ color: "#06b6d4" }}>
                  "{s.mySlot?.title}"
                </strong>{" "}
                for their{" "}
                <strong style={{ color: "#3b82f6" }}>
                  "{s.theirSlot?.title}"
                </strong>{" "}
                — Status:{" "}
                <span
                  style={{
                    background:
                      s.status === "ACCEPTED"
                        ? "#dcfce7"
                        : s.status === "REJECTED"
                        ? "#fee2e2"
                        : "#fef9c3",
                    color:
                      s.status === "ACCEPTED"
                        ? "#166534"
                        : s.status === "REJECTED"
                        ? "#991b1b"
                        : "#854d0e",
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontWeight: 600,
                  }}
                >
                  {s.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginTop: "0.5rem",
            }}
          >
            You haven’t sent any swap requests yet.
          </p>
        )}
      </div>
    </div>
  );
}
