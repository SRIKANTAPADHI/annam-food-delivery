const mongoose = require("mongoose")

const resturantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        cuisine: {
            type: String,
            required: true
        },
        rating: {
            type: String,
            dafault: 0
        },
        isOpen: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Resturant", resturantSchema);
