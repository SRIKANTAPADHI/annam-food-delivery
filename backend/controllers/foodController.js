const Food = require("../models/Food");

// CREATE FOOD

const createFood = async (req, res) => {
    try {
        const food = await Food.create(req.body);

        res.status(201).json({
            message: "Food created successfully!",
            food
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create food",
            error: error.message
        });
    }
};


// GET ALL FOOD
const getFoods = async (req, res) => {
    try {
        const {
            search,
            category,
            resturant,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            query.category = category;
        }

        if (resturant) {
            query.resturant = resturant;
        }

        const skip =
            (Number(page) - 1) * Number(limit);

        const foods = await Food.find(query)
            .populate("resturant", "name cuisine")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const totalFoods =
            await Food.countDocuments(query);

        res.status(200).json({
            success: true,
            foods,
            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                totalFoods,
                totalPages: Math.ceil(
                    totalFoods / Number(limit)
                )
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get foods",
            error: error.message
        });
    }
};

// GET ONE FOOD

const getFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)
            .populate("resturant", "name cuisine");

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        res.status(200).json({
            message: "Food found",
            food
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get food",
            error: error.message
        });
    }
};


// UPDATE FOOD
const updateFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        res.json({
            message: "Food updated successfully!",
            food
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update food",
            error: error.message
        });
    }
};


// DELETE FOOD
const deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(
            req.params.id
        );

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        res.json({
            message: "Food deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete food",
            error: error.message
        });
    }
};


module.exports = {
    createFood,
    getFoods,
    getFood,
    updateFood,
    deleteFood
};