const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

const secret = (JWT_SECRET && String(JWT_SECRET).trim()) ? JWT_SECRET : "internhub-fallback-secret";

function dbReady() {
  return mongoose.connection.readyState === 1;
}

// Register (intern or admin)
router.post("/register", async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ message: "Database is not ready. Wait a moment and try again." });
  }
  try {
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password != null ? String(body.password) : "";
    const role = ["intern", "admin"].includes(body.role) ? body.role : "intern";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ userId: String(user._id) }, secret, { expiresIn: "7d" });
    res.status(201).json({
      message: "Registration successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors || {}).map((e) => e.message).join(" ");
      return res.status(400).json({ message: msg || "Validation failed." });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const detail = err.message && !err.message.includes("password") ? err.message : "Please try again.";
    res.status(500).json({ message: "Registration failed. " + detail });
  }
});

// Login
router.post("/login", async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ message: "Database is not ready. Wait a moment and try again." });
  }
  try {
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password != null ? String(body.password) : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const match = user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: String(user._id) }, secret, { expiresIn: "7d" });
    res.json({
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

module.exports = router;
