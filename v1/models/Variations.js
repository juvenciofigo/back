const mongoose = require("mongoose");

const VariationSchema = new mongoose.Schema(
    {
        variationProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        variationType: {
            type: String,
        },
        variationValue: {
            type: String,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        variationPrice: {
            type: Number,
            required: false,
        },
        variationPromotion: {
            type: Number,
            default: null,
        },
        variationStock: {
            type: Boolean,
            required: true,
            default: true,
        },
        variationImage: {
            type: Array,
            default: [],
        },
        delivery: {
            dimensions: {
                heightCm: {
                    type: Number,
                    default: null,
                },
                widthCm: {
                    type: Number,
                    default: null,
                },
                depthCm: {
                    type: Number,
                    default: null,
                },
            },
            weight: {
                type: Number,
                required: false,
                default: null,
            },
            shippingFree: {
                type: Boolean,
                default: false,
        },
    },
    },
{ timestamps: true }
);

module.exports = mongoose.model("Variation", VariationSchema, "variations");
