const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PaymentRouterSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        totalProductsPrice: {
            type: Number,
            required: true,
        },
        paymentAt: {
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
            enum: ["Esperando", "Pagamento recusado", "Fraude suspeita", "Pago"],
            default: "Esperando",
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        transactionId: {
            type: String,
            unique: true,
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

module.exports = mongoose.model("Payment", PaymentRouterSchema, "payments");
