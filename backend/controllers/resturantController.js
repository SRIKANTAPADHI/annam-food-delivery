const Resturant = require("../models/Resturant")
const Food = require("../models/Food")

// CREATE
const createResturant = async (req, res) => {
    try {
        const resturant = await Resturant.create(req.body)
        res.status(201).json(
            { message: "Resturant created Successfully", resturant }
        )
    } catch (error) {
        res.status(500).json(
            { message: "Failed to create resturant", error: error.message }
        )
    }
}

// GET ALL

const getResturants = async (req, res) => {
    try {
        const resturants = await Resturant.find();
        res.json(
            { count: resturants.length, resturants }
        )
    } catch (error) {
        res.status(500).json(
            { message: "Failed to get Resturant", error: error.message }
        )
    }
}

// GET ONE
const getResturant = async (req, res) => {
    try {
        const resturant = await Resturant.findById(req.params.id)
        if (!resturant) {
            return res.status(404).json(
                { message: "Resturant not found" }
            )
        }
        const foods = await Food.find(
            { resturant: resturant._id }
        )
        res.json(resturant, foods)

    } catch (error) {
        res.status(500).json(
            { message: "Failed to get resturant", error: error.message }
        )
    }
}
// UPDATE

const updateResturant = async (res, req) => {
    try {
        const resturant = await Resturant.findByIdandUpdate(req.params.id, req.body,
            { new: true, runvalidators: true }
        )
        if (!resturant) {
            return res.status(404).json(
                { message: "Resturant not found" }
            )
        }
        res.json(
            { message: "Resturant updated successfully", resturant }
        )
    } catch (error) {
        res.status(500).json(
            { message: "Failed to update resturant", error: error.message }
        )
    }
}

// DELETE

const deleteResturant = async (req, res) => {
    try {
        const resturant = await Resturant.findByIdandDelete(req.params.id)
        if (!resturant) {
            return res.status(404).json(
                { message: "Resturant not found" }
            )
        }
        res.json(
            { message: "Resturant deleted successfully" }
        )
    } catch (error) {
        res.status(500).json(
            { message: "Failed to delete resturant", error: error.message }
        )
    }
}

module.exports = { createResturant, getResturants, getResturant, updateResturant, deleteResturant }