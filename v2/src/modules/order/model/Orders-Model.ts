import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IOrder, EnOrderStatus } from "../index.js";
import { IItemDetails } from "../../cart/model/cart-interface-model.js";

const OrderCartItemSchema = new Schema<IItemDetails>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
        productName: {
            type: String,
            required: true,
            min: 1,
        },
        quantity: {
            type: Number,
            default: 1,
            required: true,
        },
        picture: {
            type: String,
        },
        deliveryEstimate: {
            type: {
                additionalCost: {
                    type: Number,
                    default: 0,
                    required: true,
                },
                estimatedTime: {
                    type: String,
                    default: "IMMEDIATE",
                    required: true,
                    enum: ["IMMEDIATE", "7_DAYS", "30_DAYS"],
                },
            },
            default: {},
        },
        variation: {
            type: {
                color: {
                    type: String,
                },
                model: {
                    type: String,
                },
                size: {
                    type: String,
                },
                material: {
                    type: String,
                },
            },
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
            unique: true,
        },
        // preco do produto com preco de suas variacoes
        itemPrice: {
            type: Number,
        },
        // preco do item multiplicado com a quantidade
        subtotal: {
            type: Number,
        },
        // disponibilidade do produto
        itemAvailability: {
            type: Boolean,
            default: true,
        },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        cart: [OrderCartItemSchema],
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
        },
        delivery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Delivery",
        },
        orderRegistration: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderRegistration",
        },
        referenceOrder: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: EnOrderStatus,
            default: EnOrderStatus.PENDING,
            // Pending (Pendente): O pedido foi criado, mas ainda não foi processado.
            // Confirmed (Confirmado): O pedido foi confirmado pelo sistema ou pelo vendedor.
            // Processing (Em Processamento): O pedido está sendo processado (ex.: itens estão sendo separados no estoque).
            // Ready for Shipment (Pronto para Envio): O pedido está pronto para ser enviado.
            // Shipped (Enviado): O pedido foi despachado e está a caminho do cliente.
            // Completed (Concluído): O pedido foi finalizado e a transação está completa.
            // Cancelled (Cancelado): O pedido foi cancelado antes do envio.
            // Returned (Devolvido): O cliente devolveu o pedido.
            // Refunded (Reembolsado): O valor do pedido foi reembolsado ao cliente.
            // Failed (Falha): O processamento do pedido falhou (ex.: pagamento não autorizado).
            // On Hold (Em Espera): O pedido está em espera por algum motivo (ex.: aguardando pagamento adicional ou verificação de informações).
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);
export const OrderModel = mongoose.model<IOrder, mongoose.PaginateModel<IOrder>>("Order", OrderSchema, "orders");
