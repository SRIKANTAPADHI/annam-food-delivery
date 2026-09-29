const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/:foodId", authMiddleware, updateCartItem);
router.delete("/:foodId", authMiddleware, removeFromCart);
router.delete("/", authMiddleware, clearCart);

module.exports = router;