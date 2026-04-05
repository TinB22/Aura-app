const express = require("express");
const {
  registerToEvent,
  getMyRegistrations,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:eventId", protect, registerToEvent);
router.get("/me", protect, getMyRegistrations);

module.exports = router;