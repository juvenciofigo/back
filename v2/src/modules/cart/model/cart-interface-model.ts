import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IVariation {
    color?: Types.ObjectId;
    model?: Types.ObjectId;
    size?: Types.ObjectId;
    material?: Types.ObjectId;
}

interface IItem {
    productId: Types.ObjectId;
    quantity: number;
    deliveryEstimate?: Types.ObjectId;
    variation: IVariation;
    item: Types.ObjectId;
}

export interface ICart extends Document {
    cartItens: IItem[];
    cartUser: Types.ObjectId;
}
