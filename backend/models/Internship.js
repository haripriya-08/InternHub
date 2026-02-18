const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  stipend: { type: String, default: "" },
  duration: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Internship", internshipSchema);
