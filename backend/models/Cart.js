const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
    },

    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },

    price: {
        type: Number,
        required: true,
    },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
},
{
    timestamps:true
}
);

module.exports = mongoose.model("Cart", cartSchema);