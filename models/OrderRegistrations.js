const { object } = require("joi");
const mongoose = require("mongoose");

const OrderRegistrationSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        situation: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        payload: { type: Object },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderRegistration", OrderRegistrationSchema, "orderRegistrations");
