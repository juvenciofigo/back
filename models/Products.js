const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productDescription: {
            type: String,
            required: true,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productQuantity: {
            type: Number,
            required: true,
        },
        productImage: {
            type: String,
            required: true,
        },
        categoria: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema, "products");
