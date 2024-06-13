const mongoose = require("mongoose");

const RatingRouterSchema = new mongoose.Schema(
    {
        ratingName: {
            type: String,
            required: true,
        },
        ratingText: {
            type: String,
            required: true,
        },
        ratingScore: {
            type: Number,
            default: 0,
        },
        ratingProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },customer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingRouterSchema, "ratings");
