const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  generateCsrfToken,
  verifyCsrfToken,
} = require("../middlewares/csrfProtection");

const {
  login,
  logout,
  getCurrentAdmin,
} = require("../controllers/auth.controller");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

router.get("/csrf-token", generateCsrfToken);

router.post("/login", loginLimiter, verifyCsrfToken, login);
router.post("/logout", verifyCsrfToken, logout);

router.get("/me", getCurrentAdmin);

module.exports = router;
