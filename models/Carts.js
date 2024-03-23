const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    cartItens: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            productQuant: {
                type: Number,
                default: 1,
                min: 1,
            },
            productPrice: {
                type: Number,
                required: true,
            },
            total:{
                type:Number,
                required:true
            },
        },
    ],
    cartCustomer: {
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
