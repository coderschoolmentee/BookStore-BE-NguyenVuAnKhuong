const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  books: [
    {
      bookId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

cartSchema.methods.toJSON = function () {
  const cart = this._doc;
  delete cart.isDeleted;
  return cart;
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
