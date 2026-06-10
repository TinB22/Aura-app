const express = require("express");
const {
  getMaterials,
  createMaterial,
} = require("../controllers/materialController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMaterials);
router.post("/", protect, createMaterial);

module.exports = router;