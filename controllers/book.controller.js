const Book = require("../models/Book.js");
const Review = require("../models/Review.js");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const { default: mongoose } = require("mongoose");
const bookController = {};

// Create a new book
bookController.createBook = catchAsync(async (req, res, next) => {
  if (Array.isArray(req.body)) {
    const booksData = req.body;

    const createdBooks = [];

    for (const bookData of booksData) {
      const { name, author, price, publicationDate } = bookData;

      // Create a new book
      const book = await Book.create({
        name,
        author,
        price,
        publicationDate,
      });

      // Add the created book to the array
      createdBooks.push(book);
    }

    // Send the response with the created books
    sendResponse(
      res,
      201,
      true,
      createdBooks,
      null,
      "Books created successfully"
    );
  } else {
    const { name, author, price, publicationDate } = req.body;

    // Create a new book
    const book = await Book.create({
      name,
      author,
      price,
      publicationDate,
    });

    // Send the response with the created book
    sendResponse(res, 201, true, book, null, "Book created successfully");
  }
});

bookController.getAllBooks = catchAsync(async (req, res, next) => {
  // Extract page, limit, and search query from the query parameters
  const { page = 1, limit = 10, search } = req.query;

  // Convert page and limit to numbers
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Calculate the skip value based on the page and limit
  const skip = (pageNumber - 1) * limitNumber;

  // Create a search query object
  const searchQuery = {
    isDeleted: false,
  };

  if (search) {
    searchQuery.$or = [
      { name: { $regex: new RegExp(search, "i") } }, // Search by book name
      { categories: { $regex: new RegExp(search, "i") } }, // Search by category name
    ];
  }

  // Fetch paginated books from the database with search query
  const books = await Book.aggregate([
    {
      $match: searchQuery,
    },
    {
      $lookup: {
        from: "bookcategories",
        let: { bookId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$bookId", "$bookId"] },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $project: {
              _id: 0,
              categoryName: "$category.categoryName",
            },
          },
        ],
        as: "categories",
      },
    },
    {
      $project: {
        name: 1,
        author: 1,
        price: 1,
        publicationDate: 1,
        categories: "$categories.categoryName",
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limitNumber,
    },
  ]);

  sendResponse(res, 200, true, books, null, "Books retrieved successfully");
});

bookController.getBookById = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;

  const [book] = await Book.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(bookId), isDeleted: false },
    },
    {
      $lookup: {
        from: "bookcategories",
        let: { bookId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$bookId", "$bookId"] },
              isDelete: false,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $project: {
              _id: 0,
              categoryName: "$category.categoryName",
            },
          },
        ],
        as: "categories",
      },
    },
    {
      $project: {
        name: 1,
        author: 1,
        price: 1,
        publicationDate: 1,
        categories: "$categories.categoryName",
      },
    },
  ]);

  if (!book) {
    throw new AppError(404, "Book not found", "Get Book Error");
  }

  const reviews = await Review.find({ bookId: book._id, isDeleted: false });

  // You can now include the `reviews` array in the `book` object
  book.reviews = reviews;

  sendResponse(res, 200, true, book, null, "Book retrieved successfully");
});

// Update a book by ID
bookController.updateBook = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;
  const updateData = req.body;

  // Find the book by ID and update its data
  const book = await Book.findByIdAndUpdate(
    bookId,
    { $set: { isDeleted: false, ...updateData } },
    { new: true }
  );
  if (!book) {
    throw new AppError(404, "Book not found", "Update Book Error");
  }
  sendResponse(res, 200, true, book, null, "Book updated successfully");
});

// Delete a book by ID
bookController.deleteBook = catchAsync(async (req, res, next) => {
  const bookId = req.params.id;

  // Find the book by ID
  const book = await Book.findOne({ _id: bookId, isDeleted: false });

  if (!book) {
    throw new AppError(404, "Book not found", "Delete Book Error");
  }

  // Mark the book as deleted
  book.isDeleted = true;
  await book.save();

  sendResponse(res, 200, true, null, null, "Book deleted successfully");
});

module.exports = bookController;
