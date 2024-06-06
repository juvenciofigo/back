const { object } = require("joi");
const mongoose = require("mongoose");

const OrderRegistrationSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        packagedAt: { type: Date },
        outForDelivery: { type: Date },
        deliverydAt: { type: Date },
        canceledAt: { type: Date },
        orderStatus: {
            type: String,
            required: true,
            enem: ["Pedido realizado", "Embalando", "Cancelado", "Devolvido", "Entregue"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderRegistration", OrderRegistrationSchema, "orderRegistrations");
