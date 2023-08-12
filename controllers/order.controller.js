const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const { CLIENT_ID, APP_SECRET } = process.env;
const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",
  production: "https://api-m.paypal.com",
};
const Order = require("../models/Order");
const Book = require("../models/Book");
const User = require("../models/User");
const Cart = require("../models/Cart");
const orderController = {};

orderController.createOrder = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { books, shippingAddress, paymentMethods } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found", "Create Order Error");
  }

  const orderedBooks = [];

  for (const { bookId, quantity } of books) {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new AppError(
        404,
        `Book not found: ${bookId}`,
        "Create Order Error"
      );
    }

    const name = book.name;
    const price = book.price;
    const total = (quantity * price).toFixed(2);

    orderedBooks.push({ bookId, name, quantity, price, total });
  }

  const totalAmount = orderedBooks
    .reduce((total, { total: bookTotal }) => {
      const bookTotalNumber = parseFloat(bookTotal);
      return total + (isNaN(bookTotalNumber) ? 0 : bookTotalNumber);
    }, 0)
    .toFixed(2);

  const order = await Order.create({
    userId,
    books: orderedBooks,
    status: "Processing",
    paymentMethods,
    totalAmount,
    shippingAddress,
  });

  const bookIds = orderedBooks.map(({ bookId }) => bookId);
  await Cart.updateOne(
    { userId },
    { $pull: { books: { bookId: { $in: bookIds } } } }
  );

  sendResponse(res, 201, true, order, null, "Order created successfully");
});

orderController.getOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ isDeleted: false });
  return sendResponse(res, 200, true, orders, "Orders retrieved successfully");
});

orderController.getAllOrder = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const orders = await Order.find({ userId, isDeleted: false });

  for (const order of orders) {
    for (const book of order.books) {
      const foundBook = await Book.findById(book.bookId);
      if (foundBook) book.name = foundBook.name;
    }
  }
  sendResponse(res, 200, true, orders, null, "Orders retrieved successfully");
});

orderController.getOrderById = catchAsync(async (req, res, next) => {
  const { userId, orderId } = req.params;

  const order = await Order.findOne({ userId, _id: orderId, isDeleted: false });

  if (!order) {
    throw new AppError(404, "Order not found", "Get Order Error");
  }

  sendResponse(res, 200, true, order, null, "Order retrieved successfully");
});

orderController.updateOrder = catchAsync(async (req, res, next) => {
  const { userId, orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({ userId, _id: orderId, isDeleted: false });

  if (!order) {
    throw new AppError(404, "Order not found", "Order Error");
  }

  if (order.status === "Cancelled") {
    sendResponse(res, 200, true, null, null, "Order is already cancelled");
    return;
  }

  order.status = status;
  await order.save();

  sendResponse(res, 200, true, order, null, `Order ${status} successfully`);
});

orderController.deleteOrder = catchAsync(async (req, res, next) => {
  const { userId, orderId } = req.params;

  const order = await Order.findOne({ userId, _id: orderId, isDeleted: false });

  if (!order) {
    throw new AppError(404, "Order not found", "Order Error");
  }

  order.isDeleted = true;

  await order.save();

  sendResponse(res, 200, true, null, null, "Order deleted successfully");
});

orderController.updateOrderAD = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({ _id: orderId, isDeleted: false });

  if (!order) {
    throw new AppError(404, "Order not found", "Order Error");
  }

  if (order.status === "Cancelled") {
    throw new AppError(404, "Order is already cancelled", "Order Error");
  }

  order.status = status;
  await order.save();

  sendResponse(res, 200, true, order, null, `Order ${status} successfully`);
});

orderController.createOrder = async (totalAmount) => {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount,
          },
        },
      ],
    }),
  });

  const data = await response.json();
  return data;
};

orderController.capturePayment = async (orderId) => {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};

async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

module.exports = orderController;
