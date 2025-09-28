const mongoose = require("mongoose");
const options = require("../helpers/options");

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
        complete: {
            type: String,
            required: true,
        },
        city: {
            enum: options.cities,
            type: String,
            required: true,
        },
        province: {
            enum: options.provinces,
            type: String,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        },
        postalCode: {
            type: Number,
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
