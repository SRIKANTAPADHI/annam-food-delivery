const Review = require("../models/review")
const Food = require("../models/Food")

// Create Review
const createReview = async (req, res) => {
    try {
        const { foodId, rating, comment } = req.body;
        if (!foodId || !rating || !comment) {
            return res.status(400).json(
                { message: "Food and rating are required" }
            )
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json(
                { message: "Rating must be between 1 and 5" }
            )
        }
        const food = await Food.findById(foodId)
        if (!food) {
            return res.status(404).json(
                { message: "Food not found" }
            )
        }
        const existingReview = await Review.findOne(
            {
                user: req.user.user.Id,
                food: foodId
            }
        )
        if (!existingReview) {
            return res.status(400).json(
                { message: "you already reviewthis food" }
            )
        }
        const review = await Review.create({
            user: req.user.userId,
            food: foodId,
            resturant: food.resturant, rating, comment
        })
        res.status(201).json(
            { message: "Review added successfully", review }
        )
    } catch (error) {
        res.status(500).json(
            { message: "Failed to create review", error: error.message }
        )
    }
}
// Get review
const getFoodReviews = async (req, res) => {
    try {
        const review = await Review.fing({
            food: req.params.foodId,
        }).populate("user", "name").sort({ createdAt: -1 })
        res.json({
            success: true,
            count: reviews.length, reviews
        })
    } catch (error) {
        res.status(500).json(
            { message: "Failed to get reviews", error: error.message }
        )
    }
}

module.exports = { createReview, getFoodReviews }