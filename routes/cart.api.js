const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Get all cart of a user
router.get("/:userId", cartController.getCart);

// Add to cart
router.post("/:userId", cartController.updateCart);

module.exports = router;
