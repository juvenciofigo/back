const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                product: {
                    type: String,
                    required: true,
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
                            default: "Imediata",
                            required: true,
                            emun: ["Imediata", "7 dias", "30 dias"],
                        },
                    },
                    default: [],
                },
                variation: {
                    type: {
                        color: {
                            type: Object,
                        },
                        model: {
                            type: Object,
                        },
                        size: {
                            type: Object,
                        },
                        material: {
                            type: Object,
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
        ],
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
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
        orderCancel: {
            type: Boolean,
            default: false,
        },
        referenceOrder: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enem: ["Pendente", "Confirmado", "Em Processamento", "Pronto para Envio", "Enviado", "Concluído", "Pedido Cancelado", "Devolvido", "Reembolsado", "Falha", "Em Espera"],
            default: "Pendente",
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
module.exports = mongoose.model("Order", OrderSchema, "orders");
