import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server as IOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import swapRoutes from "./routes/swapRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://swap-slot.vercel.app",
];

// ✅ CORS Middleware (FIRST!)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Handle all OPTIONS preflight requests globally
app.options("*", cors());

// ✅ Now safe to add other middlewares
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Socket.io setup
const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const { token } = socket.handshake.query;
    if (!token) return next(new Error("No token"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id, name: decoded.name };
    return next();
  } catch (e) {
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const { id } = socket.user || {};
  if (id) {
    socket.join(String(id));
    socket.emit("socket:connected", { userId: id });
  }
  socket.on("disconnect", () => {});
});

app.set("io", io);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/swaps", swapRoutes);

app.get("/", (_, res) => res.send("SlotSwapper API running ✅"));

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
