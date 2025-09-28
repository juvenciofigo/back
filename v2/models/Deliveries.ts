import mongoose, { Schema, Document, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
interface IDelivery extends Document {
    status: string;

    cost: number;
    deliveryDeadline: number;
    order: Types.ObjectId;
    deliveryDate: Date;
    address: Types.ObjectId;
}

const DeliveryRouterSchema = new Schema<IDelivery>(
    {
        status: {
            type: String,
            required: true,
            enem: ["Pendente", "Em Processamento", "Enviado", "Em Trânsito", "Saiu para Entrega", "Entregue", "Tentativa Falha", "Devolvido", "Cancelado", "Atrasado", "Retido"],
            default: "Pendente",
            // Pending (Pendente): A entrega está aguardando processamento inicial.
            // Processing (Em Processamento): A entrega está sendo processada, o pedido foi recebido e está sendo preparado.
            // Shipped (Enviado): O pedido foi despachado e está a caminho do cliente.
            // In Transit (Em Trânsito): O pedido está em movimento e em rota para o destino.
            // Out for Delivery (Saiu para Entrega): O pedido está com o entregador e deve ser entregue em breve.
            // Delivered (Entregue): O pedido foi entregue ao cliente com sucesso.
            // Failed Attempt (Tentativa Falha): Houve uma tentativa de entrega, mas não foi possível completar a entrega (exemplo: cliente ausente).
            // Returned to Sender (Devolvido ao Remetente): O pedido foi devolvido ao remetente por algum motivo (exemplo: endereço incorreto, cliente rejeitou).
            // Cancelled (Cancelado): A entrega foi cancelada antes de ser enviada.
            // Delayed (Atrasado): A entrega está atrasada devido a circunstâncias imprevistas.
            // Held at Customs (Retido na Alfândega): A entrega está retida na alfândega e está aguardando liberação.
        },
        // deliveryCodeTrack: { type: String },
        // deliveryType: { type: String, required: true },
        cost: {
            type: Number,
            required: true,
        },
        deliveryDeadline: {
            type: Number,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        deliveryDate: {
            type: Date,
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
    },
    { timestamps: true }
);

DeliveryRouterSchema.plugin(mongoosePaginate);

export default mongoose.model("Delivery", DeliveryRouterSchema, "deliveries");
