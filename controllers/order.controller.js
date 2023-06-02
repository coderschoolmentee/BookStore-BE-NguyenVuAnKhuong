const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Order = require("../models/Order");
const Book = require("../models/Book");
const User = require("../models/User");
const Cart = require("../models/Cart");
const orderController = {};

orderController.createOrder = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { books, shippingAddress } = req.body;

  // Fetch the user
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found", "Create Order Error");
  }

  // Create an array to store the books in the order
  const orderedBooks = [];

  // Loop through the books in the request
  for (const { bookId, quantity } of books) {
    // Find the book
    const book = await Book.findById(bookId);

    if (!book) {
      throw new AppError(
        404,
        `Book not found: ${bookId}`,
        "Create Order Error"
      );
    }

    // Calculate the total price for the book
    const price = book.price;
    const total = quantity * price;

    // Add the book to the ordered books array
    orderedBooks.push({ bookId, quantity, price, total });
  }

  // Calculate the total amount for the order
  const totalAmount = orderedBooks.reduce(
    (total, { total: bookTotal }) => total + bookTotal,
    0
  );

  // Create the order
  const order = await Order.create({
    userId,
    books: orderedBooks,
    status: "Processing",
    totalAmount,
    shippingAddress,
  });

  // Delete the ordered books from the cart
  const bookIds = orderedBooks.map(({ bookId }) => bookId);
  await Cart.updateOne(
    { userId },
    { $pull: { books: { bookId: { $in: bookIds } } } }
  );

  sendResponse(res, 201, true, order, null, "Order created successfully");
});

orderController.getOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find({});
  return sendResponse(res, 200, true, orders, "Orders retrieved successfully");
});

orderController.getAllOrder = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  // Fetch all orders for the user
  const orders = await Order.find({ userId });
  sendResponse(res, 200, true, orders, null, "Orders retrieved successfully");
});

orderController.getOrderById = catchAsync(async (req, res, next) => {
  const { userId, orderId } = req.params;

  // Find the order by user ID and order ID
  const order = await Order.findOne({ userId, _id: orderId });

  if (!order) {
    throw new AppError(404, "Order not found", "Get Order Error");
  }

  sendResponse(res, 200, true, order, null, "Order retrieved successfully");
});

orderController.updateOrder = catchAsync(async (req, res, next) => {
  const { userId, orderId } = req.params;
  const { status } = req.body;
  // Find the order by user ID and order ID
  const order = await Order.findOne({ userId, _id: orderId });

  if (!order) {
    throw new AppError(404, "Order not found", "Order Error");
  }

  // If the order is already cancelled, return the order as it is
  if (order.status === "Cancelled") {
    sendResponse(res, 200, true, null, null, "Order is already cancelled");
    return;
  }

  // Update the order status to "Cancelled"
  order.status = status;
  await order.save();

  sendResponse(res, 200, true, order, null, `Order ${status} successfully`);
});

module.exports = orderController;
