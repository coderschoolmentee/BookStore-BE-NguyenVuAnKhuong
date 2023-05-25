const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// Creating a new review
router.post("/:id", reviewController.createReview);

// Get all review by userId
router.get("/", reviewController.getReview);

// Route for updating a review
router.put("/:id", reviewController.updateReview);

// Route for deleting a review
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
