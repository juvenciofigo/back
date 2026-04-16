import mongoose, { Schema } from "mongoose";
import { IPayment } from "../index.js";
import mongoosePaginate from "mongoose-paginate-v2";

const PaymentSchema = new Schema<IPayment>(
    {
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "Payment declined", "Suspected fraud", "Paid", "Order canceled"],
            default: "Pending",
        },
        paidAt: {
            type: Date,
        },
        paymentMethod: {
            type: String,
            enum: ["Mpesa", "Emola", "Paypal", "Visa", "Mastercard"],
        },
        gateway: {
            type: String,
            enum: ["Mpesa", "Emola", "Paypal", "Visa", "Mastercard"],
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true,
        },
        descriptionResponse: {
            type: String,
        },
        reference: {
            type: String,
            unique: true,
        },
        number: {
            type: String,
        },
        holderName: {
            type: String,
        },
    },
    { timestamps: true }
)

PaymentSchema.plugin(mongoosePaginate);

export const PaymentModel = mongoose.model<IPayment, mongoose.PaginateModel<IPayment>>("Payment", PaymentSchema, "payments");
