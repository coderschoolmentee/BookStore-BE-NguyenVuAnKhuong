const express = require("express");
const router = express.Router();
const bookCategory = require("../controllers/bookCategory.controller");

// GET all book categories
router.get("/", bookCategory.getAllBookCategories);

// POST create a new book category
router.post("/", bookCategory.createBookCategory);

// PUT update book categories
router.put("/:bookId", bookCategory.updateBookCategory);

// DELETE a book category by ID
router.delete("/", bookCategory.deleteBookCategory);

module.exports = router;
