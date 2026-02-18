const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const { auth, requireRole } = require("../middleware/auth");

// Apply for internship (intern only)
router.post("/", auth, requireRole("intern"), async (req, res) => {
  try {
    const { internshipId, coverMessage } = req.body;
    if (!internshipId) {
      return res.status(400).json({ message: "Internship ID is required." });
    }
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found." });
    }
    const existing = await Application.findOne({
      intern: req.user._id,
      internship: internshipId,
    });
    if (existing) {
      return res.status(400).json({ message: "You have already applied for this internship." });
    }
    const application = new Application({
      intern: req.user._id,
      internship: internshipId,
      coverMessage: coverMessage || "",
    });
    await application.save();
    await application.populate("internship");
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error." });
  }
});

// Get my applications (intern only)
router.get("/me", auth, requireRole("intern"), async (req, res) => {
  try {
    const applications = await Application.find({ intern: req.user._id })
      .populate("internship")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error." });
  }
});

// Get all applications (admin only) – for admin dashboard
router.get("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("internship")
      .populate("intern", "name email")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error." });
  }
});

// Update application status (admin only)
router.patch("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("internship")
      .populate("intern", "name email");
    if (!application) return res.status(404).json({ message: "Application not found." });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error." });
  }
});

module.exports = router;
