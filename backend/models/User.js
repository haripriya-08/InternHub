const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["intern", "admin"], default: "intern" },
  },
  { timestamps: true }
);

// Hash password before saving (async style, no next() argument to avoid middleware issues)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const plain =
    typeof this.password === "string" ? this.password : String(this.password);
  this.password = await bcrypt.hash(plain, 10);
});

// Synchronous compare for simplicity and reliability
userSchema.methods.comparePassword = function (candidate) {
  const plain = candidate != null ? String(candidate) : "";
  return bcrypt.compareSync(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);
