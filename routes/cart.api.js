const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Add to cart
router.post("/:userId", cartController.updateCart);

module.exports = router;
