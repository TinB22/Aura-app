const express = require("express");
const {
  registerToEvent,
  unregisterFromEvent,
  getMyRegistrations,
  getRegistrationsForEvent,
  removeRegistrationById,
} = require("../controllers/registrationController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/me", protect, getMyRegistrations);

router.get(
  "/event/:eventId",
  protect,
  authorizeRoles("admin"),
  getRegistrationsForEvent
);

router.post("/:eventId", protect, registerToEvent);
router.delete("/:eventId", protect, unregisterFromEvent);

router.delete(
  "/admin/:registrationId",
  protect,
  authorizeRoles("admin"),
  removeRegistrationById
);

module.exports = router;