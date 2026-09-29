const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        food:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Food",
            required:true
        },
        resturant:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Resturant",
            required:true
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },
        comment:{
            type:String,
            trim:true, 
            maxlength:500
        },
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Review", reviewSchema)