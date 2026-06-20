const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected Route
router.post("/logout", authMiddleware, logout);

module.exports = router;