import { Router } from "express";
import Event from "../models/Event.js";
import SwapRequest from "../models/SwapRequest.js";
import { auth } from "../middleware/auth.js";
import { EVENT_STATUS, SWAP_STATUS } from "../utils/constants.js";

const router = Router();

function io(req) {
  return req.app.get("io");
}

// Create swap request
router.post("/request", auth, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    const my = await Event.findOne({ _id: mySlotId, owner: req.user.id });
    const their = await Event.findById(theirSlotId);
    if (!my || !their)
      return res.status(404).json({ message: "Slot(s) not found" });
    if (String(their.owner) === req.user.id)
      return res.status(400).json({ message: "Cannot swap with yourself" });
    if (
      my.status !== EVENT_STATUS.SWAPPABLE ||
      their.status !== EVENT_STATUS.SWAPPABLE
    ) {
      return res.status(400).json({ message: "Slots must be SWAPPABLE" });
    }

    my.status = EVENT_STATUS.SWAP_PENDING;
    await my.save();
    their.status = EVENT_STATUS.SWAP_PENDING;
    await their.save();

    const swap = await SwapRequest.create({
      requester: req.user.id,
      responder: their.owner,
      mySlot: my._id,
      theirSlot: their._id,
    });

    io(req).to(String(their.owner)).emit("swap:incoming", { swapId: swap._id });

    res.json(swap);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Respond to swap
router.post("/response/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { accept } = req.body;

    const swap = await SwapRequest.findById(id)
      .populate("mySlot")
      .populate("theirSlot");
    if (!swap) return res.status(404).json({ message: "Request not found" });
    if (String(swap.responder) !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    if (swap.status !== SWAP_STATUS.PENDING)
      return res.status(400).json({ message: "Already handled" });

    const my = await Event.findById(swap.mySlot._id);
    const their = await Event.findById(swap.theirSlot._id);

    if (!accept) {
      swap.status = SWAP_STATUS.REJECTED;
      await swap.save();
      my.status = EVENT_STATUS.SWAPPABLE;
      await my.save();
      their.status = EVENT_STATUS.SWAPPABLE;
      await their.save();
      io(req)
        .to(String(swap.requester))
        .emit("swap:rejected", { swapId: swap._id });
      return res.json(swap);
    }

    // Accept – atomic (transaction) if supported
    const session = await Event.startSession();
    session.startTransaction();
    try {
      const myFresh = await Event.findById(my._id).session(session);
      const theirFresh = await Event.findById(their._id).session(session);

      const ownerA = myFresh.owner;
      const ownerB = theirFresh.owner;

      myFresh.owner = ownerB;
      myFresh.status = EVENT_STATUS.BUSY;
      await myFresh.save({ session });
      theirFresh.owner = ownerA;
      theirFresh.status = EVENT_STATUS.BUSY;
      await theirFresh.save({ session });

      swap.status = SWAP_STATUS.ACCEPTED;
      await swap.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    io(req)
      .to(String(swap.requester))
      .emit("swap:accepted", { swapId: swap._id });
    io(req)
      .to(String(swap.responder))
      .emit("swap:accepted", { swapId: swap._id });

    res.json(swap);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// My incoming/outgoing
router.get("/mine", auth, async (req, res) => {
  const incoming = await SwapRequest.find({ responder: req.user.id })
    .populate("mySlot")
    .populate("theirSlot")
    .sort({ createdAt: -1 });
  const outgoing = await SwapRequest.find({ requester: req.user.id })
    .populate("mySlot")
    .populate("theirSlot")
    .sort({ createdAt: -1 });
  res.json({ incoming, outgoing });
});

export default router;
