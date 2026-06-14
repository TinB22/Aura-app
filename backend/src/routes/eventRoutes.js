const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", protect, authorizeRoles("admin"), createEvent);
router.delete("/:id", protect, authorizeRoles("admin"), deleteEvent);

module.exports = router;