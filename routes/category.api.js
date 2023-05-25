const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// Route for creating a new category
router.post("/", categoryController.createCategory);

// Route for getting all categories
router.get("/", categoryController.getAllCategories);

// Route for getting a category by ID
router.get("/:id", categoryController.getCategoryById);

// Route for updating a category
router.put("/:id", categoryController.updateCategory);

// Route for deleting a category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
