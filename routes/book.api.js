const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");

// Create a new book
router.post("/", bookController.createBook);

// Get all books
router.get("/", bookController.getAllBooks);

// Get a book by ID
router.get("/:id", bookController.getBookById);

// Update a book by ID
router.put("/:id", bookController.updateBook);

// Delete a book by ID
router.delete("/:id", bookController.deleteBook);

module.exports = router;
