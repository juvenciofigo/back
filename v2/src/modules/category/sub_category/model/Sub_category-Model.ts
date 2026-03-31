import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ISub_category } from "../index.js";

const Sub_categorySchema = new Schema<ISub_category>(
    {
        sub_categoryName: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        availability: {
            type: Boolean,
            default: true,
            required: true,
        },
        subCategory: {
            type: Schema.Types.ObjectId,
            ref: "SubCategory",
        },
        products: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Products",
                },
            ],
        },
    },
    { timestamps: true }
);

Sub_categorySchema.plugin(mongoosePaginate);
export const Sub_categoryModel = mongoose.model("Sub_category", Sub_categorySchema, "sub_categories");
