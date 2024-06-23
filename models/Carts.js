const { number, string } = require("joi");
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
                    type: String,
                    unique: true,
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

const Cart = mongoose.model("Cart", CartSchema, "carts");

module.exports = Cart;
