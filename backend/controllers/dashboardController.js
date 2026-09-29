const User = require("../models/User")
const Resturant = require("../models/Resturant")
const Food = require("../models/Food")
const Order = require("../models/Order")

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalResturant = await Resturant.countDocuments()
        const totalFood = await Food.countDocuments()
        const totalOrder = await Order.countDocuments()

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    status: "delivered"
                }
            },
            {
                $group: {
                    _id: null,
                    totalrevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ])
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;
        res.json(
            {
                success: true,
                status: {
                    totalUsers, totalResturant, totalFood, totalOrder, totalRevenue
                }
            }
        )
    } catch (error) {
        res.status(500).json(
            { message: "Failed to get dashboard statistics", error: error.message }
        )
    }
}

module.exports = { getDashboardStats }
