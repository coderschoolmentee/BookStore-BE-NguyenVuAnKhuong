const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validate, validateLogin } = require("../middlewares/validators");
/**
 * @route POST /auth/login
 * @description Login with email and password
 * @body { email, password}
 * @access Public
 */

router.post("/login", validate(validateLogin()), authController.loginWithEmail);

module.exports = router;
