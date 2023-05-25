const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookCategoriesSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
});

const BookCategory = mongoose.model("BookCategory", bookCategoriesSchema);

module.exports = BookCategory;
