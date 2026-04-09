import { IBrand } from "../index.js";
import mongoose, { Schema, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

BrandsSchema.plugin(mongoosePaginate);

export const BrandsModel = mongoose.model<IBrand, PaginateModel<IBrand>>("Brands", BrandsSchema, "brands");
