const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
router.post(
  "/login",
  validators.validate([
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ]),
  authController.loginWithEmail
);

module.exports = router;
