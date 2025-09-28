import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ICategory } from "../index.js";

const CategorySchema = new Schema<ICategory>(
    {
        categoryName: {
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
        subCategories: [
            {
                type: Schema.Types.ObjectId,
                ref: "SubCategory",
            },
        ],
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

CategorySchema.plugin(mongoosePaginate);

export const CategoryModel = mongoose.model("Category", CategorySchema, "categories");
