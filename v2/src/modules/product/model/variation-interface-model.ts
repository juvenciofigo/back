import { Document, Types } from "mongoose";


export interface IVariation extends Document {
    variationProduct: Types.ObjectId,
    variationType: String,
    variationValue: String,
    sku: String,
    variationPrice: Number,
    variationPromotion: Number,
    variationStock: Boolean,
    variationImage: string[],
    delivery: IDelivery,
}

export interface IDelivery{
    dimensions: {
        heightCm: Number,
        widthCm: Number,
        depthCm: Number,
    },
    weight: Number,
    shippingFree: Boolean,
}