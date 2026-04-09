import { Types, Document } from "mongoose";

export interface IPayment extends Document {
    amount: number;
    totalProductsPrice: number;
    paymentDate: Date;
    paymentMethod: string;
    paymentInstallments: number;
    status: string;
    order: Types.ObjectId;
    transactionId: string;
    descriptionResponse: string;
    reference: string;
    number: string;
    holderName: string;
}