const express = require("express");
const router = express.Router();
const Internship = require("../models/Internship");
const { auth, requireRole } = require("../middleware/auth");

// GET all internships (public for listing)
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single internship (public)
router.get("/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: "Internship not found." });
    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new internship (admin only)
router.post("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const internship = new Internship({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      description: req.body.description,
      stipend: req.body.stipend || "",
      duration: req.body.duration || "",
      createdBy: req.user._id,
    });
    const newInternship = await internship.save();
    res.status(201).json(newInternship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
