const mongoose = require("mongoose");

const internSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    internships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Intern", internSchema);
