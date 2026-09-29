const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


router.use(protect);

router.post("/", createOrder);

router.get("/my-orders", getMyOrders);

router.get(
  "/admin/all",
  adminOnly,
  getAllOrders
);

router.put(
  "/admin/:id/status",
  adminOnly,
  updateOrderStatus
);

router.get("/:id", getOrder);

module.exports = router;