var express = require("express");
var router = express.Router();

const authApi = require("./auth.api");
const bookApi = require("./book.api");
const userApi = require("./user.api");
const cartApi = require("./cart.api");
const reviewApi = require("./review.api");
const categoryApi = require("./category.api");
const bookCategoryApi = require("./bookCategory.api");
const orderApi = require("./order.api");

router.get("/", function (req, res, next) {
  res.send("Welcome to BookStore");
});

router.use("/auth", authApi);
router.use("/users", userApi);
router.use("/books", bookApi);
router.use("/categories", categoryApi);
router.use("/reviews", reviewApi);
router.use("/carts", cartApi);
router.use("/bookCategory", bookCategoryApi);
router.use("/orders", orderApi);

module.exports = router;
