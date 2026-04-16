import { Types, Document } from "mongoose";
import { IItemDetails } from "../../cart/model/cart-interface-model.js";



export interface IOrder extends Document {
    customer: Types.ObjectId | any;
    cart: IItemDetails[];
    payment?: Types.ObjectId | any;
    delivery?: Types.ObjectId | any;
    orderRegistration?: Types.ObjectId | any;
    referenceOrder: string;
    status: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export enum EnOrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    READY_TO_SHIP = "READY_TO_SHIP",
    SHIPPED = "SHIPPED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    FAILED = "FAILED",
    ON_HOLD = "ON_HOLD",
}

