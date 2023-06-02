const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { validate, validateUser } = require("../middlewares/validators");
const authorize = require("../middlewares/authorization");
// Register a user
router.post("/", validate(validateUser()), userController.register);

// Get all users
router.get("/", authorize(["admin"]), userController.getAllUsers);

// Get a user by ID
router.get("/:id", userController.getUserById);

// Update user profile
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", authorize(["admin"]), userController.deleteUser);

module.exports = router;
