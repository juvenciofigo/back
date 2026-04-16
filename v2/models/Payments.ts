import mongoose, { Schema, Document, Types, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface IPayment extends Document {
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
}

const PaymentRouterSchema = new Schema<IPayment>(
    {
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Esperando", "Pagamento recusado", "Fraude suspeita", "Pago", "Pedido Cancelado"],
            default: "Esperando",
        },
        paidAt: {
            type: Date,
        },
        paymentMethod: {
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
);

PaymentRouterSchema.plugin(mongoosePaginate);

export default model("Payment", PaymentRouterSchema, "payments");
