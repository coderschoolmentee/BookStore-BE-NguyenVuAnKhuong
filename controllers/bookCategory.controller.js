const BookCategory = require("../models/Book_categories");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Book = require("../models/Book");
const Category = require("../models/Category");

const bookCategoryController = {};

bookCategoryController.getAllBookCategories = catchAsync(async (req, res) => {
  const bookCategories = await BookCategory.find({ isDelete: false });
  return sendResponse(
    res,
    200,
    true,
    bookCategories,
    null,
    "All book categories retrieved successfully"
  );
});

bookCategoryController.createBookCategory = catchAsync(async (req, res) => {
  const { bookId, categoryIds } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError("Book not found", 404);
  }

  const createdBookCategories = [];

  for (const categoryId of categoryIds) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const existingLink = await BookCategory.findOne({ bookId, categoryId });
    if (existingLink) {
      throw new AppError("Link already exists between book and category", 400);
    }

    const newBookCategory = new BookCategory({
      categoryId,
      bookId,
    });

    const savedBookCategory = await newBookCategory.save();

    createdBookCategories.push(savedBookCategory);
  }

  return sendResponse(
    res,
    201,
    true,
    createdBookCategories,
    null,
    "Book category created successfully"
  );
});

bookCategoryController.errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return sendResponse(
      res,
      err.statusCode,
      false,
      null,
      err.message,
      err.message
    );
  }
};

bookCategoryController.deleteBookCategory = catchAsync(async (req, res) => {
  const { bookcategoryId } = req.params;

  const bookCategory = await BookCategory.findOne({
    bookcategoryId,
    isDeleted: false,
  });

  if (!bookCategory) {
    return sendResponse(
      res,
      404,
      false,
      null,
      "Book category not found",
      "Delete failed"
    );
  }

  bookCategory.isDeleted = true;
  await bookCategory.save();

  return sendResponse(
    res,
    200,
    true,
    null,
    null,
    "Book category marked as deleted successfully"
  );
});

module.exports = bookCategoryController;
