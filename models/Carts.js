const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    cartItens: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    cartUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
