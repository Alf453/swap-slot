import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

export default function useSocket() {
  const { token } = useAuth();
  const ref = useRef(null);

  useEffect(() => {
    if (!token) return;
    const s = io("http://localhost:5000", { query: { token } });

    s.on("socket:connected", () => {});
    s.on("swap:incoming", () => {
      alert("New swap request received!");
    });
    s.on("swap:accepted", () => {
      alert("A swap was accepted!");
    });
    s.on("swap:rejected", () => {
      alert("A swap was rejected.");
    });

    ref.current = s;
    return () => {
      s.disconnect();
    };
  }, [token]);

  return ref.current;
}
