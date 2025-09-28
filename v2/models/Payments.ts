import mongoose, { Schema, Document, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface IPayment extends Document {
    amount: number;
    totalProductsPrice: number;
    paymentDate: Date;
    paymentMethod: string;
    paymentInstallments: number;
    status: string;
    order: Types.ObjectId;
    transactionId: string;
    rescriptionResponse: string;
    reference: string;
    number: string;
    holderName: string;
}

const PaymentRouterSchema = new Schema<IPayment>(
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
        rescriptionResponse: {
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

PaymentRouterSchema.plugin(mongoosePaginate);

export default mongoose.model("Payment", PaymentRouterSchema, "payments");
