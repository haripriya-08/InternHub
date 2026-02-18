const express = require("express");
const router = express.Router();
const Internship = require("../models/Internship"); // 👈 EXACT (capital I)

/* ================= ADD INTERNSHIP ================= */
router.post("/add-internship", async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      duration,
      stipend,
      description
    } = req.body;

    const internship = new Internship({
      title,
      company,
      location,
      duration,
      stipend,
      description
    });

    await internship.save();

    res.status(201).json({
      message: "Internship added successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
