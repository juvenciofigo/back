const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ViewsProductsSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        views: {
            type: Number,
            default: 1,
        },
        guests: [
            {
                ip: String,
                userAgent: Object,
            },
        ],
        location: [
            {
                city: {
                    type: String,
                    default: undefined,
                },
                country: {
                    type: String,
                    default: undefined,
                },
                province: {
                    type: String,
                    default: undefined,
                },
            },
        ],
        referrer: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

// Índice para otimizar busca por produto + data
ViewsProductsSchema.index({ product: 1, createdAt: 1 });

ViewsProductsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("ViewsProducts", ViewsProductsSchema, "viewsProducts");
