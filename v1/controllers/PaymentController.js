const Orders = require("../models/Orders");
const Payments = require("../models/Payments");
const { Products } = require("../models/Products/Products");
const Variations = require("../models/Variations");
const Mpesa = require("./integracoes/Mpesa/MpesaTrasation");

// Funcao verificar cada item do carinho

// Controlador para pagamentos
class PaymentController {
    async verifyCart(order) {
        let totalAmount = 0;

        for (const item of order.cart) {
            const product = await Products.findById(item.productId);

            // Se o produto não existir, marca como indisponível e pula para o próximo
            if (!product) {
                console.warn(`Produto com ID ${item.productId} não encontrado`);
                item.itemAvailability = false;
                item.subtotal = 0;
                item.productPrice = 0;
                continue;
            }

            // Se o produto não estiver disponível, marca como indisponível e pula para o próximo
            if (!product.productAvailability || !product.productStock) {
                console.warn(`Produto com ID ${item.productId} não está disponível`);
                item.itemAvailability = false;
                item.subtotal = 0;
                item.productPrice = 0;
                continue;
            }

            // Buscar variações do produto, se existirem
            const variations = await Promise.all([
                item.variation?.color ? Variations.findById(item.variation.color._id) : null,
                item.variation?.model ? Variations.findById(item.variation.model._id) : null,
                item.variation?.size ? Variations.findById(item.variation.size._id) : null,
                item.variation?.material ? Variations.findById(item.variation.material._id) : null,
            ]);

            // Verificar se as variações alteram o preço
            const [color, model, size, material] = variations;
            let price = product.productPrice;
            if (color) price += color.variationPrice;
            if (model) price += model.variationPrice;
            if (size) price += size.variationPrice;
            if (material) price += material.variationPrice;

            // Calcular subtotal do item
            const subtotal = price * item.quantity;

            // Atualizar os valores do item
            item.subtotal = subtotal;
            item.productPrice = price;

            // Atualizar o total do pedido
            totalAmount += subtotal;
        }

        // Se o valor total mudou, salvar no pedido

        order.payment.amount = totalAmount + order.delivery.cost;
        await order.save();

        return order;
    }

    PayOrder = async (req, res, next) => {
        const { client_number, orderId } = req.body;
        const { paymentMode } = req.query;

        try {
            if (!paymentMode) {
                return res.status(400).json({ message: "Modo de pagamento inválido" });
            }
            if (!orderId) {
                return res.status(400).json({ message: "Falha no pagamento." });
            }

            const order = await Orders.findById(orderId).populate(["payment", "delivery"]);

            if (!order) {
                return res.status(404).json({ message: "Pedido não encontrado!" });
            }

            if (!order.payment || order.payment.status !== "Esperando") {
                return res.status(400).json({ message: `O estado do pedido é ${order.payment?.status || "Indefinido"}` });
            }

            // verificar o itens do carrinho
            const newOrder = await this.verifyCart(order);

            // fazer pagamento pelo mpesa
            let paymentResponse = {};

            if (paymentMode.toLowerCase() === "mpesa") {
                try {
                    const data = {
                        client_number,
                        value: newOrder.payment.amount,
                        third_party_reference: newOrder.referenceOrder,
                        transaction_reference: newOrder.referenceOrder,
                    };

                    paymentResponse = await Mpesa.c2b(data);
                } catch (error) {
                    console.error("Erro ao processar pagamento M-Pesa:", error);
                    return res.status(500).json({ message: "Erro ao processar pagamento. Tente novamente mais tarde." });
                }
            }

            // se o Pagamento for realizando com sucesso
            if (paymentResponse.status === 200 || paymentResponse.status === 201) {
                // actualizar o pagamento do pedido
                const payment = await Payments.findById(order.payment._id);
                payment.rescriptionResponse = paymentResponse.output_ResponseCode;
                payment.paymentDate = Date.now();
                payment.paymentMethod = "Mpesa";
                payment.status = "Pago";
                payment.transactionId = paymentResponse.output_TransactionID;
                payment.reference = paymentResponse.output_ThirdPartyReference;
                payment.number = client_number;
                await payment.save();

                // resposta para o cliente
                res.status(paymentResponse.status).json({ message: paymentResponse.output_ResponseDesc });

                //  estatistica do produto quanto as compras depois de pago
                const productPromises = newOrder.cart.map(async (item) => {
                    const product = await Products.findById(item.productId);
                    if (!product) {
                        console.warn(`Produto com ID ${item.productId} não encontrado`);
                        return;
                    }
                    product.order_items.push(order._id);
                    product.timesPurchased += item.quantity;
                    product.totalRevenue += item.subtotal;
                    product.sales.push({ quantity: item.quantity, date: new Date(), customer: order.customer });
                    return product.save();
                });
                await Promise.all(productPromises);
            } else {
                // se o pagamento não for realizado com sucesso
                console.log("error", paymentResponse);
                return res.status(paymentResponse.status || 400).json({ message: paymentResponse.output_ResponseDesc });
            }
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new PaymentController();
