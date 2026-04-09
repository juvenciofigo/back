import { Document, Types } from "mongoose";

export interface ICustomer extends Document {
    user: Types.ObjectId;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    phone: string;
    nationality: string;
    gender: string;
    birthDate: Date;
    addresses: Types.ObjectId[];
    deleted: boolean
}

export interface ICreateCustomerRequest {
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    nationality: string;
    gender: string;
    birthDate: Date;
}