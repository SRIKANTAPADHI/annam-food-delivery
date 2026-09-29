const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const resturantRoutes = require("./routes/resturantRoutes");
const authRoutes = require("./routes/authRoutes")
const foodRoutes = require("./routes/foodRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const categoryRoutes = require("./routes/categoryRoutes");

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.json(
        { Message: "Food Delevery Backend running" }
    )
})
app.use("/api/auth", authRoutes)
app.use("/api/resturants", resturantRoutes)
app.use("/api/foods/", foodRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes)
app.use("/api/categories", categoryRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {

    app.listen(process.env.PORT, () => {
        console.log(`server running on port ${process.env.PORT}`);

    })
})
    .catch((error) => {
        console.log("MongoDB Error:", error.message);

    })