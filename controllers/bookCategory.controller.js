const BookCategory = require("../models/Book_categories");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Book = require("../models/Book");
const Category = require("../models/Category");

const bookCategoryController = {};

// GET all book categories
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

  // Check if the bookId exists
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError("Book not found", 404);
  }

  // Create an array to store the created bookCategory objects
  const createdBookCategories = [];

  // Loop through the categoryIds array
  for (const categoryId of categoryIds) {
    // Check if the categoryId exists
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Check if there is already a link between bookId and categoryId
    const existingLink = await BookCategory.findOne({ bookId, categoryId });
    if (existingLink) {
      throw new AppError("Link already exists between book and category", 400);
    }

    // Create a new BookCategory object
    const newBookCategory = new BookCategory({
      categoryId,
      bookId,
    });

    // Save the new BookCategory
    const savedBookCategory = await newBookCategory.save();

    // Push the saved BookCategory to the createdBookCategories array
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

// Error handling middleware
bookCategoryController.errorHandler = (err, req, res, next) => {
  // Handle the specific error thrown in the controller
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

// DELETE a book category by ID
bookCategoryController.deleteBookCategory = catchAsync(async (req, res) => {
  const { categoryId, bookId } = req.body;

  const bookCategory = await BookCategory.findOne({ categoryId, bookId });

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

  // Check if the book category is already deleted
  if (bookCategory.isDeleted) {
    return sendResponse(
      res,
      400,
      false,
      null,
      "Book category is already deleted",
      "Delete operation failed"
    );
  }

  // Set isDeleted field to true
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
