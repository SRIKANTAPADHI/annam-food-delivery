const express = require("express");

const {
  createReview,
  getFoodReviews,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReview);

router.get("/food/:foodId", getFoodReviews);

module.exports = router;