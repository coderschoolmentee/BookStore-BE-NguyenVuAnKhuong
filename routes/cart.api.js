const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Create a new cart
router.post("/", cartController.addToCart);

// Remove cart
// router.put("/:id", cartController.removeCart);

module.exports = router;
