const express = require("express");
const router = express.Router();
const Internship = require("../models/Internship");

// GET ALL INTERNSHIPS
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// SEED DATA
router.get("/seed", async (req, res) => {
  try {
    await Internship.deleteMany();

    await Internship.insertMany([
      {
        title: "Frontend Developer Intern",
        company: "TechNova",
        location: "Remote",
        description: "Work with React and build modern UI."
      },
      {
        title: "Backend Developer Intern",
        company: "CodeSphere",
        location: "Bangalore",
        description: "Develop REST APIs using Node.js."
      },
      {
        title: "Full Stack Intern",
        company: "DevHub",
        location: "Hyderabad",
        description: "Work on complete MERN applications."
      }
    ]);

    res.json({ message: "Internships seeded successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
