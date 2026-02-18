const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

const router = express.Router();

/* =========================
   REGISTER STUDENT
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save student
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword
    });

    await newStudent.save();

    // 5. Response
    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   LOGIN STUDENT
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Student not registered" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Success response
    res.status(200).json({
      message: "Login successful",
      studentId: student._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
