const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Intern = require("../models/Intern");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Intern.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newIntern = new Intern({
      name,
      email,
      password: hashedPassword
    });

    await newIntern.save();

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const intern = await Intern.findOne({ email });
    if (!intern) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, intern.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      internId: intern._id
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
