const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const DeliveryRouterSchema = new mongoose.Schema(
    {
        deliveryStatus: {
            type: String,
            required: true,
            enem: ["Não iniciado", "Inciado", "Enviado", "Cancelado", "Devolvido", "Entregue"],
        },
        // deliveryCodeTrack: { type: String },
        // deliveryType: { type: String, required: true },
        deliveryCost: {
            type: Number,
            required: true,
        },
        deliveryDeadline: {
            type: Number,
        },
        deliveryOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
    },
    { timestamps: true }
);

DeliveryRouterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Delivery", DeliveryRouterSchema, "deliveries");
