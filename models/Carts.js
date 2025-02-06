const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        cartItens: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: true,
                },
                variation: {
                    type: {
                        color: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Variation",
                        },
                        model: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Variation",
                        },
                        size: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Variation",
                        },
                        material: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Variation",
                        },
                    },
                },
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: () => new mongoose.Types.ObjectId(),
                },
            },
        ],
        cartUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, _id: true }
);

module.exports = mongoose.model("Cart", CartSchema, "carts");
