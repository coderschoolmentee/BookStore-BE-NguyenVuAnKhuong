const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

//Create a order
router.post("/:userId", orderController.createOrder);

//Get all order
router.get("/", orderController.getOrder);

//Get all order of a user
router.get("/:userId", orderController.getAllOrder);

//Get a order of a user
router.get("/:userId/:orderId", orderController.getOrderById);

//Cancer a order
router.delete("/:userId/:orderId", orderController.updateOrder);

module.exports = router;
