const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const authorize = require("../middlewares/authorization");
const authController = require("../controllers/auth.controller");

// Create a new book
router.post("/", authorize(["admin"]), bookController.createBook);

// Get all books
router.get("/", bookController.getAllBooks);

// Get a book by ID
router.get("/:id", bookController.getBookById);

// Update a book by ID
router.put("/:id", authorize(["admin"]), bookController.updateBook);

// Delete a book by ID
router.delete("/:id", authorize(["admin"]), bookController.deleteBook);

module.exports = router;
