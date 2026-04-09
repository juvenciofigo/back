import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IVariation } from "../index.js";

const VariationRouterSchema = new Schema<IVariation>(
    {
        variationProduct: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        variationType: {
            type: String,
        },
        variationValue: {
            type: String,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        variationPrice: {
            type: Number,
            required: false,
        },
        variationPromotion: {
            type: Number,
            default: null,
        },
        variationStock: {
            type: Boolean,
            required: true,
            default: true,
        },
        variationImage: {
            type: [String],
            default: [],
        },
        delivery: {
            type: {
                dimensions: {
                    type: {
                        heightCm: {
                            type: Number,
                            default: null,
                        },
                        widthCm: {
                            type: Number,
                            default: null,
                        },
                        depthCm: {
                            type: Number,
                            default: null,
                        },
                    },
                    required: false,
                },
                weight: {
                    type: Number,
                    required: false,
                    default: null,
                },
                shippingFree: {
                    type: Boolean,
                    default: false,
                },
            },
        },
    },
    { timestamps: true }
);

VariationRouterSchema.plugin(mongoosePaginate);

export const VariationModel = mongoose.model<IVariation, mongoose.PaginateModel<IVariation>>("Variation", VariationRouterSchema, "variations");
