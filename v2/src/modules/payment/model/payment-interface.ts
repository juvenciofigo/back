import { Types, Document } from "mongoose";

export interface IPayment extends Document {
    amount: number;
    status: string;
    paidAt: Date;
    paymentMethod: string;
    order: Types.ObjectId;
    transactionId: string;
    descriptionResponse: string;
    reference: string;
    number: string;
    holderName: string;
    gateway: string;
}
