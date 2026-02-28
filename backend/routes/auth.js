const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

const secret = JWT_SECRET || "internhub-secret-key-change-in-production";

function dbReady() {
  return mongoose.connection.readyState === 1;
}

function normalizeRole(val) {
  const r = String(val || "").toLowerCase().trim();
  if (r === "admin" || r === "employer") return "admin";
  return "intern";
}

// Register (intern or admin)
router.post("/register", async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ message: "Database is not ready. Wait a moment and try again." });
  }
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const name = (body.name != null && typeof body.name === "string") ? body.name.trim() : "";
    const email = (body.email != null && typeof body.email === "string") ? body.email.trim().toLowerCase() : "";
    const password = body.password != null ? String(body.password) : "";
    const role = normalizeRole(body.role);

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already registered. Try signing in." });
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
    console.error("Register error:", err.message, err.name);
    if (err.name === "ValidationError" && err.errors) {
      const msg = Object.values(err.errors).map((e) => e.message).join(" ");
      return res.status(400).json({ message: msg || "Validation failed." });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered. Try signing in." });
    }
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ message: "Database is not ready. Wait a moment and try again." });
  }
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const email = (body.email != null && typeof body.email === "string") ? body.email.trim().toLowerCase() : "";
    const password = body.password != null ? String(body.password) : "";

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    const user = await User.findOne({ email });
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
