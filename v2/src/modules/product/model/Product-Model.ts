import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { IBrand, IProduct, IProfit, ISale, ITag } from "../index.js";

const SaleSchema = new Schema<ISale>(
    {
        quantity: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            require: true,
        },
    },
    { timestamps: true }
);

const TagsSchema = new Schema<ITag>(
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
                require: true,
            },
        ],
    },
    { timestamps: true }
);

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

const ProfitSchema = new Schema<IProfit>(
    {
        acquisitionCost: {
            type: Number,
            required: true,
        },
        additionalCosts: {
            type: Number,
            default: 0, // custos adicionais, como impostos, transporte, etc.
        },
        profitMargin: {
            type: Number,
            default: function () {
                return this.productPrice - this.acquisitionCost - this.additionalCosts;
            },
        },
    },
    { timestamps: true }
);

const ProductSchema = new Schema<IProduct>(
    {
        productName: {
            type: String,
            required: true,
        },
        productDescription: {
            type: String,
            required: true,
        },
        productSpecifications: {
            type: String,
            required: true,
        },
        productAvailability: {
            type: Boolean,
            default: true,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productStock: {
            type: Boolean,
            required: true,
            default: true,
        },
        productImage: {
            type: Array,
            default: [],
        },
        productCategory: {
            type: [{ type: Schema.Types.ObjectId, ref: "Category" }],
        },
        productSubcategory: {
            type: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
        },
        productSub_category: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Sub_category",
                },
            ],
        },
        productRatings: {
            type: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
        },
        productVariations: {
            type: [{ type: Schema.Types.ObjectId, ref: "Variation" }],
        },
        productPromotion: {
            type: Number,
            default: undefined,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        productVendor: {
            type: String,
            required: true,
        },
        productModel: {
            type: String,
        },
        productBrand: {
            type: Schema.Types.ObjectId,
            ref: "Brands",
            default: undefined,
        },
        productWeight: {
            type: Number,
            default: undefined,
        },
        productLength: {
            type: Number,
            default: undefined,
        },
        productWidth: {
            type: Number,
            default: undefined,
        },
        productHeight: {
            type: Number,
            default: undefined,
        },
        order_items: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        timesPurchased: {
            type: Number,
            default: 0,
        },
        totalRevenue: {
            type: Number,
            default: 0,
        },
        deliveryEstimate: {
            type: [
                {
                    additionalCost: {
                        type: Number,
                        default: 0,
                        required: true,
                    },
                    estimatedTime: {
                        type: String,
                        default: "Imediata",
                        required: true,
                        emun: ["Imediata", "7 dias", "30 dias"],
                    },
                },
            ],
            default: [],
        },
        sales: [SaleSchema],
        profit: [ProfitSchema],
    },
    { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);
export const Tags = mongoose.model("Tags", TagsSchema, "tags");
export const Products = mongoose.model("Products", ProductSchema, "products");
export const Brands = mongoose.model("Brands", BrandsSchema, "brands");
