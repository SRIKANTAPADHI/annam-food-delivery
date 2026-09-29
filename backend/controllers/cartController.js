const Cart = require("../models/Cart");
const Food = require("../models/Food");

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "User authentication failed",
      });
    }

    const { foodId, quantity = 1 } = req.body;

    if (!foodId) {
      return res.status(400).json({
        message: "Food ID is required",
      });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (!food.isAvailable) {
      return res.status(400).json({
        message: "Food is not available",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [
          {
            food: food._id,
            quantity: Number(quantity),
            price: food.price,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.food.toString() === foodId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({
          food: food._id,
          quantity: Number(quantity),
          price: food.price,
        });
      }

      await cart.save();
    }

    await cart.populate(
      "items.food",
      "name price image resturant"
    );

    return res.status(200).json({
      message: "Food added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    return res.status(500).json({
      message: "Failed to add food",
      error: error.message,
    });
  }
};


// GET CART
const getCart = async (req, res) => {
  try {
   if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "User authentication failed",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate(
      "items.food",
      "name price image resturant"
    );
    if (!cart) {
      return res.status(200).json({
        items: [],
      });
    }

    return res.status(200).json({
      items: cart.items,
    });

  } catch (error) {
    console.error("GET CART ERROR:", error);

    return res.status(500).json({
      message: "Failed to get cart",
      error: error.message,
    });
  }
};


// UPDATE QUANTITY
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (Number(quantity) < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.food.toString() === req.params.foodId
    );

    if (!item) {
      return res.status(404).json({
        message: "Food not found in cart",
      });
    }

    item.quantity = Number(quantity);

    await cart.save();

    await cart.populate(
      "items.food",
      "name price image resturant"
    );

    return res.json({
      message: "Cart updated",
      cart,
    });

  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    return res.status(500).json({
      message: "Failed to update cart",
      error: error.message,
    });
  }
};


// REMOVE ITEM
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.food.toString() !== req.params.foodId
    );

    await cart.save();

    await cart.populate(
      "items.food",
      "name price image resturant"
    );

    return res.json({
      message: "Food removed from cart",
      cart,
    });

  } catch (error) {
    console.error("REMOVE CART ERROR:", error);

    return res.status(500).json({
      message: "Failed to remove food",
      error: error.message,
    });
  }
};


// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.json({
        message: "Cart already empty",
      });
    }

    cart.items = [];

    await cart.save();

    return res.json({
      message: "Cart cleared",
    });

  } catch (error) {
    console.error("CLEAR CART ERROR:", error);

    return res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};


module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};