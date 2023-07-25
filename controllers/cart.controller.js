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

  console.log("Request:", req.body);

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
  console.log(cart.books);
  if (!cart) {
    console.log("Creating new cart...");

    cart = new Cart({
      userId,
      books: [
        { bookId, quantity: parseInt(quantity), price: parseFloat(price) },
      ],
    });
  } else {
    console.log("Updating existing cart...");

    let bookExists = false;

    cart.books = cart.books.map((book) => {
      if (book.bookId === bookId) {
        if (parseInt(quantity) === 0) {
          return null;
        } else {
          bookExists = true;
          return {
            ...book,
            quantity: parseInt(quantity),
            price: parseFloat(price),
          };
        }
      }
      return book;
    });

    cart.books = cart.books.filter((book) => book !== null);

    if (!bookExists && parseInt(quantity) > 0) {
      cart.books.push({
        bookId,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      });
    }

    await cart.save();
  }

  return sendResponse(res, 200, true, null, null, "Cart updated successfully");
});

module.exports = cartController;
