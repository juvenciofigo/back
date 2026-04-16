import { Types, Document } from "mongoose";
import { IAddress, IItemDetails } from "../index.js";

export interface IDelivery extends Document {
    status: string;
    deliveryDeadline: Date;
    order: Types.ObjectId;
    customer: Types.ObjectId;
    deliveredAt: Date;
    shippingAddress: {
        addressId: Types.ObjectId,
        province: Types.ObjectId,
        city: Types.ObjectId,
        neighborhood?: Types.ObjectId | undefined;
        terminal?: Types.ObjectId | undefined;
        cellNumber: string,
        reference?: string | undefined,
        complete?: string | undefined,
        note?: string | undefined,
    },
    logistics: {
        baseFee: number;
        tollFee?: number | undefined;
        weightFee?: number | undefined;
        totalShipping: number;
    };
    vehicleClass: 'motorcycle' | 'lightVehicle' | 'heavyVehicle';
    trackingCode?: string | undefined;
}

export enum EnDeliveryStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    READY_TO_SHIP = "READY_TO_SHIP",
    SHIPPED = "SHIPPED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
}

export interface ICreateDeliveryRequest {
    orderId: string;
    customerId: string;
    cartItems: IItemDetails[];
    address: IAddress;
}

export interface IGetDeliveryRequest {
    search?: string;
    sort?: string;
    status?: string;
    deliveryType?: string;
    trackingCode?: string;
    deliveryDeadline?: string
}

export interface IFetchDeliveriesRequest {
    search?: string;
    sort?: string;
    status?: string;
    deliveryType?: string;
    trackingCode?: string;
    deliveryDeadline?: string
}