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
router.put("/:userId/:orderId", orderController.updateOrder);

// Update Order for Admin
router.put("/:orderId", orderController.updateOrderAD);

// create a new order paypal
router.post("/create-paypal-order", async (req, res) => {
  const order = await orderController.createOrder();
  res.json(order);
});

// capture payment & store order information or fullfill order
router.post("/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  const captureData = await orderController.capturePayment(orderID);
  res.json(captureData);
});

//Delete a order
router.delete("/:userId/:orderId", orderController.deleteOrder);

module.exports = router;
