const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema(
    {
        resturant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resturant",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        image: {
            type: String,
            default: ""
        },
        category: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        rating: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Food", foodSchema)