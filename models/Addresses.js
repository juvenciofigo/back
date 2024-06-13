const mongoose = require("mongoose");
const AddressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        neighborhood: {
            type: String,
            required: true,
        },
        complete: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        cellNumber: {
            type: String,
            required: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema, "addresses");
