const express = require("express");
const {
  registerToEvent,
  getMyRegistrations,
  getRegistrationsByEvent,
  unregisterFromEvent,
  adminRemoveRegistration,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Named routes first (before wildcard params)
router.get("/me", protect, getMyRegistrations);
router.get("/event/:eventId", protect, authorizeRoles("admin"), getRegistrationsByEvent);

// Wildcard routes after
router.post("/:eventId", protect, registerToEvent);
router.delete("/:eventId", protect, unregisterFromEvent);
router.delete("/admin/:registrationId", protect, authorizeRoles("admin"), adminRemoveRegistration);


module.exports = router;