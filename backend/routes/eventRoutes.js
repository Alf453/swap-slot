import { Router } from "express";
import Event from "../models/Event.js";
import { auth } from "../middleware/auth.js";
import { EVENT_STATUS } from "../utils/constants.js";

const router = Router();

// Create event
router.post("/", auth, async (req, res) => {
  try {
    const { title, startTime, endTime, status = EVENT_STATUS.BUSY } = req.body;
    const ev = await Event.create({
      title,
      startTime,
      endTime,
      status,
      owner: req.user.id,
    });
    res.json(ev);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// My events
router.get("/mine", auth, async (req, res) => {
  const list = await Event.find({ owner: req.user.id }).sort({ startTime: 1 });
  res.json(list);
});

// Update event
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const update = await Event.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    req.body,
    { new: true }
  );
  if (!update) return res.status(404).json({ message: "Event not found" });
  res.json(update);
});

// Delete event
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const del = await Event.findOneAndDelete({ _id: id, owner: req.user.id });
  if (!del) return res.status(404).json({ message: "Event not found" });
  res.json({ ok: true });
});

// Marketplace – all others' swappable
router.get("/swappable", auth, async (req, res) => {
  const items = await Event.find({
    owner: { $ne: req.user.id },
    status: EVENT_STATUS.SWAPPABLE,
  })
    .populate("owner", "name email")
    .sort({ startTime: 1 });
  res.json(items);
});

export default router;
