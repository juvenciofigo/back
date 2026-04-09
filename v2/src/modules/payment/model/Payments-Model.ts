import mongoose, { Schema } from "mongoose";
import { IPayment } from "../index.js";
import mongoosePaginate from "mongoose-paginate-v2";

const PaymentSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        totalProductsPrice: {
            type: Number,
            required: true,
        },
        paymentDate: {
            type: Date,
        },
        paymentMethod: {
            type: String,
            enum: ["Mpesa", "Emola", "Paypal", "Visa", "Mastercard"],
        },
        paymentInstallments: {
            type: Number,
            default: 1,
        },
        status: {
            type: String,
            required: true,
            enum: ["Esperando", "Pagamento recusado", "Fraude suspeita", "Pago", "Pedido Cancelado"],
            default: "Esperando",
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
);

PaymentSchema.plugin(mongoosePaginate);

export const PaymentModel = mongoose.model<IPayment, mongoose.PaginateModel<IPayment>>("Payment", PaymentSchema, "payments");
