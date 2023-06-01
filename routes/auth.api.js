const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validate, validateLogin } = require("../middlewares/validators");

router.post("/login", validate(validateLogin()), authController.loginWithEmail);

module.exports = router;
