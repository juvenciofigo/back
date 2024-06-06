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
        paymentForm: {
            type: String,
            enum: ["Mpesa", "Emola", "Paypal", "Visa", "Mastercard"],
        },
        paymentInstallments: {
            type: Number,
            default: 1,
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ["Esperando", "Pagamento recusado", "Fraude suspeita", "Pago"],
        },
        paymentOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    },
    { timestamps: true }
);

PaymentRouterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Payment", PaymentRouterSchema, "payments");
