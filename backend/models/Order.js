const mongoose = require("mongoose")
const orderItemSchema = new mongoose.Schema(
    {
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    },
    { _id: false }
)

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: {
            type: [orderItemSchema],
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        },
        deliveryFee: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true
        },
        deliveryAddress: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancel"]
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)
