import { Document, Types } from "mongoose";

export interface IAddress extends Document {
    customer: Types.ObjectId;
    complete: string;
    city: Types.ObjectId;
    province: Types.ObjectId;
    neighborhood: Types.ObjectId;
    reference?: string;
    note?: string;
    cellNumber: string;
    deleted: boolean;
}

export interface ICreateAddressRequest {
    userId: string;
    complete: string;
    city: string;
    province: string;
    neighborhood: string;
    reference?: string;
    note?: string;
    cellNumber: string;
}
