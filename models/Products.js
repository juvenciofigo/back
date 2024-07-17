const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SaleSchema = new mongoose.Schema(
    {
        quantity: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    { _id: false }
);

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
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        },
        productSubcategory: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
        },
        productSub_category: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Sub_category",
                },
            ],
        },
        productRatings: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
        },
        productVariations: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }],
        },
        productPromotion: {
            type: Number,
            default: undefined,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        productVendor: {
            type: String,
            required: true,
        },
        productModel: {
            type: String,
            default: undefined,
        },
        productBrand: {
            type: String,
            default: undefined,
        },
        productWeight: {
            type: Number,
            default: undefined,
        },
        productLength: {
            type: Number,
            default: undefined,
        },
        productWidth: {
            type: Number,
            default: undefined,
        },
        productHeight: {
            type: Number,
            default: undefined,
        },
        order_items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        timesPurchased: {
            type: Number,
            default: 0,
        },
        totalRevenue: {
            type: Number,
            default: 0,
        },
        sales: [SaleSchema],
    },
    { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Product", ProductSchema, "products");
