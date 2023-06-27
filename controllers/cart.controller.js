const Cart = require("../models/Cart");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const cartController = {};

cartController.getCart = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  return sendResponse(
    res,
    200,
    true,
    cart.books,
    null,
    "Cart retrieved successfully"
  );
});
cartController.updateCart = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { bookId, quantity, price } = req.body;

  if (!bookId) {
    return sendResponse(
      res,
      400,
      false,
      null,
      "Book ID is required",
      "Cart update failed"
    );
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // If the cart doesn't exist, create a new cart
    cart = new Cart({
      userId,
      books: [{ bookId, quantity: parseInt(quantity), price: parseInt(price) }],
    });
  } else {
    // Check if the book already exists in the cart
    const existingBookIndex = cart.books.findIndex(
      (book) => book.bookId && book.bookId.toString() === bookId
    );
    if (existingBookIndex === -1) {
      // If the book doesn't exist, add it to the cart
      cart.books.push({
        bookId,
        quantity: parseInt(quantity),
        price: parseInt(price),
      });
    } else {
      // If the book already exists, update the quantity and price
      cart.books[existingBookIndex].quantity = parseInt(quantity);
      cart.books[existingBookIndex].price = parseInt(price);
    }
  }

  await cart.save();

  return sendResponse(
    res,
    200,
    true,
    cart.books,
    null,
    "Cart updated successfully"
  );
});

module.exports = cartController;
