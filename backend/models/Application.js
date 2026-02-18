const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  coverMessage: { type: String, default: "" },
}, { timestamps: true });

applicationSchema.index({ intern: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
