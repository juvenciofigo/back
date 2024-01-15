const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quant: {
        type: Number,
        default: 1,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const CartSchema = new mongoose.Schema({
    itens: [cartItemSchema],
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
    },
    payment: {
        card: {
            number: {
                type: String,
                required: true,
                minlength: 12,
                maxlength: 19,
            },
            cvc: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 4,
            },
        },
    },
    total: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Cart", CartSchema, "carts");
