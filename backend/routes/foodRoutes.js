const express = require("express");

const {
  createFood,
  getFoods,
  getFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFood);

router.post("/", protect, adminOnly, createFood);
router.put("/:id", protect, adminOnly, updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

module.exports = router;