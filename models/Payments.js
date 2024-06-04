const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PaymentRouterSchema = new mongoose.Schema(
    {
        Amount: {
            type: Number,
            required: true,
        },
        PaymentForm: {
            type: String,
            enum: ["Mpesa", "Emola", "Paypal", "Visa", "Mastercard"],
        },
        PaymentInstallments: {
            type: Number,
            default: 1,
        },
        PaymentStatus: {
            type: String,
            required: true,
            enum: ["Espera de pagamento", "Pagamento recusado", "Fraude suspeita", "Pago"],
        },
        paymentOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        payload: {
            type: Object,
        },
    },
    { timestamps: true }
);

PaymentRouterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Payment", PaymentRouterSchema, "payments");
