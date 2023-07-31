const Category = require("../models/Category");
const Book = require("../models/Book");
const BookCategory = require("../models/Book_categories");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const categoryController = {};

categoryController.createCategory = catchAsync(async (req, res, next) => {
  if (Array.isArray(req.body)) {
    const categoriesData = req.body;

    const createdCategories = [];

    for (const categoryData of categoriesData) {
      const { categoryName, description } = categoryData;

      const category = await Category.create({ categoryName, description });

      createdCategories.push(category);
    }

    sendResponse(
      res,
      201,
      true,
      createdCategories,
      null,
      "Categories created successfully"
    );
  } else {
    const { categoryName, description } = req.body;

    const category = await Category.create({ categoryName, description });

    sendResponse(
      res,
      201,
      true,
      category,
      null,
      "Category created successfully"
    );
  }
});

categoryController.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isDeleted: false });

  sendResponse(
    res,
    200,
    true,
    categories,
    null,
    "Categories retrieved successfully"
  );
});

categoryController.getCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { page = 1, limit = 5, search = "" } = req.query;

  const category = await Category.findOne({ _id: id, isDeleted: false });

  if (!category) {
    throw new AppError(404, "Category not found", "Category Error");
  }

  const query = { categoryId: category._id };

  if (search) {
    query.name = { $regex: new RegExp(search, "i") };
  }

  const bookCategory = await BookCategory.find(query);

  const bookIds = bookCategory.map((item) => item.bookId);

  const totalBooks = bookIds.length;
  const totalPages = Math.ceil(totalBooks / limit);

  const skipItems = (page - 1) * limit;
  const paginatedBookIds = bookIds.slice(skipItems, skipItems + limit);

  const books = await Book.find({
    _id: { $in: paginatedBookIds },
    isDeleted: false,
  });

  const response = {
    category,
    books,
    totalPages,
    currentPage: page,
    totalBooks,
  };

  sendResponse(
    res,
    200,
    true,
    response,
    null,
    "Category and books retrieved successfully"
  );
});

categoryController.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { categoryName } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { categoryName, isDeleted: false },
    { new: true }
  );

  if (!category) {
    throw new AppError(404, "Category not found", "Category Error");
  }

  sendResponse(res, 200, true, category, null, "Category updated successfully");
});

categoryController.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id, isDeleted: false });

  if (!category) {
    throw new AppError(404, "Category not found", "Category Error");
  }
  category.isDeleted = true;
  await category.save();

  sendResponse(res, 200, true, null, null, "Category deleted successfully");
});

module.exports = categoryController;
