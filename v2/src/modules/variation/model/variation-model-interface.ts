import { Document, Types } from "mongoose";

export interface IVariation extends Document {
    variationProduct: Types.ObjectId;
    variationType: string;
    variationValue: string;
    sku: string;
    variationPrice: number;
    variationPromotion?: number;
    variationStock: boolean;
    variationImage: string[];
    delivery: IDelivery
}

export interface IDelivery {
    dimensions: {
        heightCm: number;
        widthCm: number;
        depthCm: number;
    };
    weight: number;
    shippingFree: boolean;
}