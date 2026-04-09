import { Types, Document } from "mongoose";

export interface IOrderDeliveryEstimate {
    additionalCost: number;
    estimatedTime: string;
}

export interface IOrderVariation {
    color?: any;
    model?: any;
    size?: any;
    material?: any;
}

export interface IOrderCartItem {
    productId: Types.ObjectId | any;
    product: string;
    quantity: number;
    picture?: string;
    deliveryEstimate?: IOrderDeliveryEstimate;
    variation?: IOrderVariation;
    item: Types.ObjectId;
    itemPrice: number;
    subtotal: number;
    itemAvailability?: boolean;
}

export interface IOrder extends Document {
    customer: Types.ObjectId | any;
    cart: IOrderCartItem[];
    address: Types.ObjectId | any;
    payment?: Types.ObjectId | any;
    delivery?: Types.ObjectId | any;
    orderRegistration?: Types.ObjectId | any;
    orderCancel: boolean;
    referenceOrder: string;
    status: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
