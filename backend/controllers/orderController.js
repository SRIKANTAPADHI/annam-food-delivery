const Cart = require("../models/Cart");
const Order = require("../models/Order");

// Create Order
const createOrder = async (req, res) => {
  try {

    const { deliveryAddress, paymentMethod = "cod" } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "User authentication is invalid",
      });
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
      return res.status(400).json({
        message: "Delivery Address is required",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.food");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Check food items
    const invalidItem = cart.items.find(
      (item) => !item.food
    );

    if (invalidItem) {
      return res.status(400).json({
        message: "One or more food items are no longer available",
      });
    }

    // Create order items using FOOD PRICE
    const orderItems = cart.items.map((item) => {
      const price = Number(item.food.price);
      const quantity = Number(item.quantity);

      if (!Number.isFinite(price)) {
        throw new Error(
          `Invalid food price for ${item.food.name}`
        );
      }

      if (!Number.isFinite(quantity) || quantity < 1) {
        throw new Error(
          `Invalid quantity for ${item.food.name}`
        );
      }

      return {
        food: item.food._id,
        name: item.food.name,
        quantity,
        price,
      };
    });

    // Calculate subtotal
    const subtotal = orderItems.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    // Delivery fee
    const deliveryFee = 40;

    // 3% tax
    const tax = Number(
      (subtotal * 0.03).toFixed(2)
    );

    // Final amount
    const totalAmount =
      subtotal + deliveryFee + tax;

    // Safety check
    if (
      !Number.isFinite(subtotal) ||
      !Number.isFinite(tax) ||
      !Number.isFinite(totalAmount)
    ) {
      return res.status(400).json({
        message: "Invalid order amount",
      });
    }

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
      paymentMethod,
    });

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order created successfully!",
      order,
    });

  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};


const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "User authentication is invalid",
      });
    }

    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate(
        "items.food",
        "name image"
      )
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
};


const getOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "User authentication is invalid",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate("items.food");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json(order);

  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .populate(
        "items.food",
        "name image"
      )
      .sort({ createdAt: -1 });

    return res.json(orders);

  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "canceled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json({
      message:
        "Order status updated successfully",
      order,
    });

  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
};