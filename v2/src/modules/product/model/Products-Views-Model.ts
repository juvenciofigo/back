import mongoose, { Schema, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IViewsProducts } from "../index.js";

const ViewsProductsSchema = new Schema<IViewsProducts>(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        views: {
            type: Number,
            default: 1,
        },
        guests: [
            {
                ip: { type: String },
                userAgent: { type: Object },
                location: {
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
                referrer: {
                    type: String,
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    { timestamps: true }
);

// Índice para otimizar busca por produto + data
ViewsProductsSchema.index({ product: 1, createdAt: 1 });

ViewsProductsSchema.plugin(mongoosePaginate);
export const ViewsProductsModel = mongoose.model<IViewsProducts, PaginateModel<IViewsProducts>>("ViewsProducts", ViewsProductsSchema, "viewsProducts");
