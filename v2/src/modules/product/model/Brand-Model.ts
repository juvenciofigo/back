import { IBrand } from "../index.js";
import mongoose, { Schema } from "mongoose";

const BrandsSchema = new Schema<IBrand>(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Products",
            },
        ],
    },
    { timestamps: true }
);

export const BrandsModel = mongoose.model("Brands", BrandsSchema, "brands");
