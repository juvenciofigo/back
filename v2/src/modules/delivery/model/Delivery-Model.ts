import { PaginateModel, Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { EnDeliveryStatus, IDelivery } from "../index.js";

const DeliveryRouterSchema = new Schema<IDelivery>(
    {
        status: {
            type: String,
            required: true,
            enum: Object.values(EnDeliveryStatus),
            default: EnDeliveryStatus.PENDING,
        },
        deliveredAt: {
            type: Date,
        },
        deliveryDeadline: {
            type: Date,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        shippingAddress: {
            addressId: {
                type: Schema.Types.ObjectId,
                ref: "Address",
            },
            province: {
                type: Schema.Types.ObjectId,
                ref: "Province",
                required: true,
            },
            city: {
                type: Schema.Types.ObjectId,
                ref: "City",
                required: true,
            },
            neighborhood: {
                type: Schema.Types.ObjectId,
                ref: "Neighborhood",
            },
            terminal: {
                type: Schema.Types.ObjectId,
                ref: "CarrierTerminal",
            },
            cellNumber: String,
            reference: String,
            complete: String,
            note: String,
        },
        logistics: {
            baseFee: {
                type: Number,
                required: true,
            },
            tollFee: {
                type: Number,
                default: 0,
            },
            weightFee: {
                type: Number,
                default: 0,
            },
            totalShipping: {
                type: Number,
                required: true,
            },
        },
        vehicleClass: {
            type: String,
            enum: ["motorcycle", "lightVehicle", "heavyVehicle"],
        },
        trackingCode: {
            type: String,
            unique: true,
            // Ex: DEL-2026-XXXX
        },
    },
    { timestamps: true }
);

DeliveryRouterSchema.plugin(mongoosePaginate);

export const DeliveryModel = model<IDelivery, PaginateModel<IDelivery>>("Delivery", DeliveryRouterSchema, "deliveries");
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
// Held at Customs (Retido na Alfândega): A entrega está retida na alfândega e está aguardando libertação.
