const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CategorySchema = new mongoose.Schema(
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
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubCategory",
            },
        ],
        products: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                },
            ],
        },
    },
    { timestamps: true }
);

const SubCategorySchema = new mongoose.Schema(
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        sub_categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
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
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                },
            ],
        },
    },
    { timestamps: true }
);

const Sub_categorySchema = new mongoose.Schema(
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
        },
        products: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                },
            ],
        },
    },
    { timestamps: true }
);

CategorySchema.plugin(mongoosePaginate);
SubCategorySchema.plugin(mongoosePaginate);
Sub_categorySchema.plugin(mongoosePaginate);

const Category = mongoose.model("Category", CategorySchema, "categories");
const SubCategory = mongoose.model("SubCategory", SubCategorySchema, "subCategories");
const Sub_category = mongoose.model("Sub_category", Sub_categorySchema, "sub_categories");

module.exports = { Category, SubCategory, Sub_category };
