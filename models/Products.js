const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
        productAvailability: {
            type: Boolean,
            default: true,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productStock: {
            type: Boolean,
            required: true,
            default: true,
        },
        productImage: {
            type: Array,
            default: [],
        },
        productCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        productRatings: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
        },
        productVariations: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }],
        },
        productPromotion: {
            type: Number,
            default: null,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Product", ProductSchema, "products");
