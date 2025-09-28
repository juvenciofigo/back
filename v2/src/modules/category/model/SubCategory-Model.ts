import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ISubCategory } from "../index.js";

const SubCategorySchema = new Schema<ISubCategory>(
    {
        subCategoryName: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
        sub_categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "Sub_category",
            },
        ],
        availability: {
            type: Boolean,
            default: true,
            required: true,
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

SubCategorySchema.plugin(mongoosePaginate);

export const SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema, "subCategories");
