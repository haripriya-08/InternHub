const express = require("express");
const router = express.Router();
const Internship = require("../models/Internship.js");

// GET ALL INTERNSHIPS
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// SEED ROUTE
router.get("/seed", async (req, res) => {
  try {
    await Internship.deleteMany();

    await Internship.insertMany([
      {
        title: "Frontend Developer Intern",
        company: "Google",
        location: "Remote",
        description: "Work on React-based UI systems."
      },
      {
        title: "Backend Developer Intern",
        company: "Microsoft",
        location: "Bangalore",
        description: "Build scalable Node.js APIs."
      },
      {
        title: "AI Research Intern",
        company: "OpenAI",
        location: "Remote",
        description: "Work on machine learning models."
      }
    ]);

    res.send("Seeded Successfully");
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
