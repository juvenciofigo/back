const mongoose = require("mongoose");

const VariationRouterSchema = new mongoose.Schema(
    {
        variationProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
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
            type: {
                dimensions: {
                    type: {
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
                    required: false,
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Variation", VariationRouterSchema, "variations");
