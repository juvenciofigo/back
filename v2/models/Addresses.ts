import mongoose from "mongoose";
import { cities, provinces } from "../helpers/options.js";

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
            enum: cities,
            type: String,
            required: true,
        },
        province: {
            enum: provinces,
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

export default mongoose.model("Address", AddressSchema, "addresses");
