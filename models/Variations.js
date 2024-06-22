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
                        heightCm: { type: Number },
                        widthCm: { type: Number },
                        depthCm: { type: Number },
                    },
                    required: false,
                },
                weight: { type: Number, required: false },
                shippingFree: { type: Boolean, default: false },
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Variation", VariationRouterSchema, "variations");
