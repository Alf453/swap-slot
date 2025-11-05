import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Event from "./models/Event.js";
import { EVENT_STATUS } from "./utils/constants.js";

dotenv.config();

await connectDB(process.env.MONGO_URI);

await Promise.all([User.deleteMany({}), Event.deleteMany({})]);

const [alice, bob] = await User.create([
  { name: "Alice", email: "alice@example.com", password: "password" },
  { name: "Bob", email: "bob@example.com", password: "password" },
]);

await Event.create([
  {
    title: "Team Meeting",
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60e3),
    status: EVENT_STATUS.SWAPPABLE,
    owner: alice._id,
  },
  {
    title: "Focus Block",
    startTime: new Date(Date.now() + 24 * 60 * 60e3),
    endTime: new Date(Date.now() + 25 * 60 * 60e3),
    status: EVENT_STATUS.SWAPPABLE,
    owner: bob._id,
  },
  {
    title: "Deep Work",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60e3),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60e3 + 60 * 60e3),
    status: EVENT_STATUS.BUSY,
    owner: alice._id,
  },
]);

console.log(
  "Seeded users: alice@example.com / bob@example.com (password: password)"
);
await mongoose.disconnect();
