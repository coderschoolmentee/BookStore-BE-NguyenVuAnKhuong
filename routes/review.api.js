const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// Creating a new review
router.post("/:id", reviewController.createReview);

// Get all review by userId
router.get("/:id", reviewController.getReview);

// update a review
router.put("/:id", reviewController.updateReview);

// delete a review
router.delete("/:id/:reviewId", reviewController.deleteReview);

module.exports = router;
