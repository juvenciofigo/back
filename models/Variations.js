const mongoose = require("mongoose");

const VariationRouterSchema = new mongoose.Schema(
    {
        variationCode: {
            type: String,
            required: true,
            unique: true,
        },
        variationName: {
            type: String,
            required: true,
        },
        variationPrice: {
            type: Number,
            required: true,
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
                    required: true,
                },
                weight: { type: Number, required: true },
                shippingFree: { type: Boolean, default: false },
            },
        },
        variationQuantity: {
            type: Number,
            default: 100,
        },
        variationProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variationAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Variation", VariationRouterSchema, "variations"); // Corrigido o nome da coleção
