const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const userController = require("../controllers/user.controller");
const validators = require("../middlewares/validators");
const authorize = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
// Register a user
router.post(
  "/",
  validators.validate([
    body("name").notEmpty().withMessage("name is required"),
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
  userController.register
);

// Get all users
router.get(
  "/",
  authentication.loginRequire,
  authorize(["admin"]),
  userController.getAllUsers
);

// Get current user
router.get("/me", authentication.loginRequire, userController.getCurrentUser);

// Get a user by ID
router.get(
  "/:id",
  authentication.loginRequire,
  // validators.validate([
  //   param("id").exists().isString().custom(validators.checkObjectId),
  // ]),
  userController.getUserById
);

// Update user profile
router.put("/:id", authentication.loginRequire, userController.updateUser);

// Delete user
router.delete(
  "/:id",
  authentication.loginRequire,
  authorize(["admin"]),
  userController.deleteUser
);

module.exports = router;
