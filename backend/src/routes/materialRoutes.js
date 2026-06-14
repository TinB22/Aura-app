const express = require("express");
const {
  getMaterials,
  createMaterial,
  deleteMaterial,
} = require("../controllers/materialController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getMaterials);
router.post("/", protect, createMaterial);
router.delete("/:id", protect, authorizeRoles("admin"), deleteMaterial);

module.exports = router;