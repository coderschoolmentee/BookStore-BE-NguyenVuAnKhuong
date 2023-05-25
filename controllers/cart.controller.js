const Cart = require("../models/Cart");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const cartController = {};

// Create a new cart
cartController.addToCart = catchAsync(async (req, res, next) => {
  const { userId, books } = req.body;

  const cart = new Cart({
    userId,
    books,
  });

  const savedCart = await cart.save();

  sendResponse(res, 200, true, savedCart, null, "Cart created successfully");
});

module.exports = cartController;
