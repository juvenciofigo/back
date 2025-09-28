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
            enem: ["Pendente", "Confirmado", "Em Processamento", "Pronto para Envio", "Enviado", "Concluído", "Pedido Cancelado", "Devolvido", "Reembolsado", "Falha", "Em Espera"],
            default: "Pendente",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderRegistration", OrderRegistrationSchema, "orderRegistrations");
