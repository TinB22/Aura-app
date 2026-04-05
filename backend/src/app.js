const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const materialRoutes = require("./routes/materialRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/registrations", registrationRoutes);
app.use("/api/materials", materialRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

module.exports = app;