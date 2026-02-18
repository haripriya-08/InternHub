const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "internhub-secret-key-change-in-production";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found." });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
};

module.exports = { auth, requireRole, JWT_SECRET };
