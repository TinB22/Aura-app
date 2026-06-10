const express = require("express");
const {
  registerToEvent,
  getMyRegistrations,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyRegistrations);
router.post("/:eventId", protect, registerToEvent);


module.exports = router;