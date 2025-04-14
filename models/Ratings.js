const mongoose = require("mongoose");

const RatingRouterSchema = new mongoose.Schema(
    {
        ratingText: {
            type: String,
            required: true,
        },
        ratingScore: {
            type: Number,
            default: 0,
            min: 1,
            max: 5,
        },
        ratingProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        deletedby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingRouterSchema, "ratings");
