const Category = require("../models/Category");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const categoryController = {};

categoryController.createCategory = catchAsync(async (req, res, next) => {
  if (Array.isArray(req.body)) {
    const categoriesData = req.body;

    const createdCategories = [];

    for (const categoryData of categoriesData) {
      const { categoryName, description } = categoryData;

      // Create a new category
      const category = await Category.create({ categoryName, description });

      // Add the created category to the array
      createdCategories.push(category);
    }

    // Send the response with the created categories
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

    // Create a new category
    const category = await Category.create({ categoryName, description });

    // Send the response with the created category
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
  // Get all categories
  const categories = await Category.find({ isDeleted: false });

  // Send the response with the categories
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

  // Get the category by ID
  const category = await Category.findOne({ _id: id, isDeleted: false });

  if (!category) {
    throw new AppError(404, "Category not found", "Category Error");
  }

  // Send the response with the category
  sendResponse(
    res,
    200,
    true,
    category,
    null,
    "Category retrieved successfully"
  );
});

categoryController.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { categoryName } = req.body;

  // Update the category
  const category = await Category.findByIdAndUpdate(
    id,
    { categoryName, isDeleted: false },
    { new: true }
  );

  if (!category) {
    throw new AppError(404, "Category not found", "Category Error");
  }

  // Send the response with the updated category
  sendResponse(res, 200, true, category, null, "Category updated successfully");
});

categoryController.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Delete the category
  const category = await Category.findOne({ _id: id, isDeleted: false });

  if (!category) {
    throw new AppError(404, "Category not found", "Category Error");
  }
  category.isDeleted = true;
  await category.save();
  // Send the response with the deleted category
  sendResponse(res, 200, true, null, null, "Category deleted successfully");
});

module.exports = categoryController;
