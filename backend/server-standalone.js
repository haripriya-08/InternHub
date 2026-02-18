/**
 * Standalone server – works WITHOUT MongoDB (in-memory store).
 * Use this if you get 500 on register or MongoDB connection issues.
 * Run: node server-standalone.js
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "internhub-standalone-secret";

const users = new Map();
const internships = new Map();
const applications = new Map();
let userIdCounter = 1;
let internshipIdCounter = 1;
let applicationIdCounter = 1;

function createId(prefix) {
  if (prefix === "user") return String(userIdCounter++);
  if (prefix === "internship") return String(internshipIdCounter++);
  if (prefix === "application") return String(applicationIdCounter++);
  return String(Date.now());
}

app.get("/", (req, res) => res.send("InternHub API (standalone) is running."));
app.get("/api/health", (req, res) => res.json({ ok: true, db: "memory" }));

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role = "intern" } = req.body || {};
    const n = (name && String(name).trim()) || "";
    const e = (email && String(email).trim().toLowerCase()) || "";
    const p = password != null ? String(password) : "";
    const r = ["intern", "admin"].includes(role) ? role : "intern";
    if (!n || !e || !p) return res.status(400).json({ message: "Name, email and password are required." });
    if (p.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });
    const existing = [...users.values()].find((u) => u.email === e);
    if (existing) return res.status(400).json({ message: "Email already registered." });
    const hashed = bcrypt.hashSync(p, 10);
    const id = createId("user");
    const user = { _id: id, name: n, email: e, password: hashed, role: r };
    users.set(id, user);
    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      message: "Registration successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed. " + (err.message || "Please try again.") });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const e = (email && String(email).trim().toLowerCase()) || "";
    const p = password != null ? String(password) : "";
    if (!e || !p) return res.status(400).json({ message: "Email and password are required." });
    const user = [...users.values()].find((u) => u.email === e);
    if (!user) {
      return res.status(401).json({
        message:
          "Account not found. If you're using the standalone backend, data resets when the server restarts—please register again.",
      });
    }
    const ok = bcrypt.compareSync(p, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
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

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Access denied." });
  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    const user = users.get(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found." });
    req.user = { _id: user._id, name: user.name, email: user.email, role: user.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

app.get("/api/internships", (req, res) => {
  const list = [...internships.values()].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  res.json(list);
});

app.get("/api/internships/:id", (req, res) => {
  const job = internships.get(req.params.id);
  if (!job) return res.status(404).json({ message: "Internship not found." });
  res.json(job);
});

app.post("/api/internships", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied." });
  const { title, company, location, description, stipend, duration } = req.body || {};
  if (!title || !company || !location || !description) return res.status(400).json({ message: "Missing required fields." });
  const id = createId("internship");
  const job = {
    _id: id,
    title,
    company,
    location,
    description,
    stipend: stipend || "",
    duration: duration || "",
    createdBy: req.user._id,
    createdAt: Date.now(),
  };
  internships.set(id, job);
  res.status(201).json(job);
});

app.post("/api/applications", authMiddleware, (req, res) => {
  if (req.user.role !== "intern") return res.status(403).json({ message: "Access denied." });
  const { internshipId, coverMessage } = req.body || {};
  if (!internshipId) return res.status(400).json({ message: "Internship ID is required." });
  if (!internships.has(internshipId)) return res.status(404).json({ message: "Internship not found." });
  const exists = [...applications.values()].some((a) => a.intern === req.user._id && a.internship === internshipId);
  if (exists) return res.status(400).json({ message: "You have already applied for this internship." });
  const id = createId("application");
  const appRecord = {
    _id: id,
    intern: req.user._id,
    internship: internshipId,
    status: "pending",
    coverMessage: coverMessage || "",
    createdAt: Date.now(),
  };
  applications.set(id, appRecord);
  const job = internships.get(internshipId);
  res.status(201).json({ ...appRecord, internship: job });
});

app.get("/api/applications/me", authMiddleware, (req, res) => {
  if (req.user.role !== "intern") return res.status(403).json({ message: "Access denied." });
  const list = [...applications.values()]
    .filter((a) => a.intern === req.user._id)
    .map((a) => ({ ...a, internship: internships.get(a.internship) }))
    .filter((a) => a.internship)
    .sort((a, b) => b.createdAt - a.createdAt);
  res.json(list);
});

app.get("/api/applications", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied." });
  const list = [...applications.values()].map((a) => ({
    ...a,
    internship: internships.get(a.internship),
    intern: users.get(a.intern) ? { name: users.get(a.intern).name, email: users.get(a.intern).email } : null,
  })).sort((a, b) => b.createdAt - a.createdAt);
  res.json(list);
});

app.patch("/api/applications/:id", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied." });
  const { status } = req.body || {};
  if (!["pending", "accepted", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status." });
  const appRecord = applications.get(req.params.id);
  if (!appRecord) return res.status(404).json({ message: "Application not found." });
  appRecord.status = status;
  const job = internships.get(appRecord.internship);
  const intern = users.get(appRecord.intern);
  res.json({ ...appRecord, internship: job, intern: intern ? { name: intern.name, email: intern.email } : null });
});

app.listen(PORT, () => {
  console.log("InternHub standalone server (no MongoDB) running on http://localhost:" + PORT);
  console.log("You can register, login, apply, and use the app. Data is in-memory (resets on restart).");
});
