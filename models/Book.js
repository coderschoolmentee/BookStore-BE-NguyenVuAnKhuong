const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    publicationDate: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

bookSchema.methods.toJSON = function () {
  const book = this._doc;
  delete book.isDeleted;
  return book;
};

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
