import mongoose, { Schema, Document, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface Iguests {
    ip: string;
    userAgent: object;
    location: {
        city: string;
        country: string;
        province: string;
    };
    referrer: string;
    user: Types.ObjectId;
}

interface IViewsProducts extends Document {
    product: Types.ObjectId;
    views: number;
    guests: [Iguests];
}

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
export default mongoose.model("ViewsProducts", ViewsProductsSchema, "viewsProducts");
