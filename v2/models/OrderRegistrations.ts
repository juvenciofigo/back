import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrderRegistration extends Document {
    order: Types.ObjectId;
    packagedAt: Date;
    outForDelivery: Date;
    deliverydAt: Date;
    canceledAt: Date;
    orderStatus: string;
}

const OrderRegistrationSchema = new Schema<IOrderRegistration>(
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

export default mongoose.model("OrderRegistration", OrderRegistrationSchema, "orderRegistrations");
