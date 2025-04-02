const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SaleSchema = new mongoose.Schema(
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            require: true,
        },
    },
    { timestamps: true }
);

const TagsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

const ProfitSchema = new mongoose.Schema(
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

const ProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productDescription: {
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
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        },
        productSubcategory: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
        },
        productSub_category: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Sub_category",
                },
            ],
        },
        productRatings: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
        },
        productVariations: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }],
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
            type: String,
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
                type: mongoose.Schema.Types.ObjectId,
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
        sales: [SaleSchema],
        // profit: [ProfitSchema],
    },
    { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);
const Tags = mongoose.model("Tags", TagsSchema, "tags");
const Products = mongoose.model("Product", ProductSchema, "products");

module.exports = { Tags, Products };
