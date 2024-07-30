// Chaves de API e configurações SSL
const api_key = process.env.API_KEY;
const public_key = process.env.PUBLIC_KEY;
const ssl = process.env.SSL;

// Inicialização e criação do objeto Mpesa
const Mpesa = require("./integracoes/Mpesa/mpesa");
const mpesa = Mpesa.init(api_key, public_key, ssl);
const Orders = require("../models/Orders");
const Payments = require("../models/Payments");
const Product = require("../models/Products");
const Variations = require("../models/Variations");
const api = require("../config/index").api;

// Função para resposta do cliente com base no código de resposta
function responseClient(data) {
    switch (data.output_ResponseCode) {
        case "INS-0":
            return "Pagamento efectuado.";
        case "INS-4":
            return "Número fora de área.";
        case "INS-5":
            return "Transação cancelada pelo cliente.";
        case "INS-6":
            return "Falha na transação.";
        case "INS-9":
            return "Tempo limite da solicitação.";
        case "INS-13":
            return "Código inválido.";
        case "INS-15":
            return "Valor inválido usado.";
        case "INS-19":
            return "Referência de terceiros inválida.";
        case "INS-23":
            return "Status desconhecido. Entre em contato com o Suporte da M-Pesa.";
        case "INS-995":
            return "Perfil do cliente tem problemas.";
        case "INS-2006":
            return "Saldo insuficiente.";
        case "INS-2051":
            return "Número inválido.";
        case "INS-10":
            return "Transação duplicada.";
        default:
            return "Erro no pagamento.";
    }
}

// Controlador para pagamentos
class PaymentController {
    async mpesaPay(req, res, next) {
        const { client_number, orderId } = req.body;

        try {
            if (!orderId) {
                return res.status(400).json({ message: "Falha no pagamento." });
            }

            const order = await Orders.findById(orderId).populate("payment");

            if (!order) {
                return res.status(404).json({ message: "Pedido não encontrado!" });
            }
            if (order.payment.status !== "Esperando") {
                return res.status(400).json({ message: `O estado do pedido é ${order.payment.status}` });
            }

            const data = {
                client_number,
                value: order.payment.amount,
                third_party_reference: order.referenceOrder,
                transaction_reference: order.referenceOrder,
            };

            const response = await mpesa.c2b(data);
            const client_response = responseClient(response.data);
            const payment = await Payments.findById(order.payment._id);

            if (response.status === 200 || response.status === 201) {
                payment.rescriptionResponse = response.data.output_ResponseCode;
                payment.paymentDate = Date.now();
                payment.paymentMethod = "Mpesa";
                payment.status = "Pago";
                payment.transactionId = response.data.output_TransactionID;
                payment.reference = response.data.output_ThirdPartyReference;
                payment.number = client_number;
                await payment.save();

                res.status(response.status).json({ message: client_response });

                for (const item of order.cart) {
                    const product = await Product.findById(item.productId);

                    if (!product) {
                        throw new Error(`Produto com ID ${item.productId} não encontrado`);
                    }

                    let color = null;
                    let model = null;
                    let size = null;
                    let material = null;

                    if (item.variation.color) {
                        color = await Variations.findById(item.variation.color._id);
                    }
                    if (item.variation.model) {
                        model = await Variations.findById(item.variation.model._id);
                    }
                    if (item.variation.size) {
                        size = await Variations.findById(item.variation.size._id);
                    }

                    if (item.variation.material) {
                        material = await Variations.findById(item.variation.material._id);
                    }

                    let price = product.productPrice;

                    if (color) {
                        price += color.variationPrice;
                    }
                    if (model) {
                        price += model.variationPrice;
                    }
                    if (material) {
                        price += material.variationPrice;
                    }
                    if (size) {
                        price += size.variationPrice;
                    }

                    let subtotal = price * item.quantity;

                    order.cartPayd.push({
                        productId: product._id,
                        product: product.productName,
                        picture: product.productImage[0],
                        variation: {
                            color: color ? color.variationValue : null,
                            model: model ? model.variationValue : null,
                            size: size ? size.variationValue : null,
                            material: material ? material.variationValue : null,
                        },
                        productPrice: price,
                        quantity: item.quantity,
                        subtotal: subtotal,
                    });

                    product.order_items.push(orderId);
                    product.timesPurchased += item.quantity;
                    product.totalRevenue += subtotal;
                    product.sales.push({ quantity: item.quantity, date: new Date() });
                    await product.save();
                }
                await order.save();
            } else {
                return res.status(response.status).json({ message: client_response });
            }
        } catch (error) {
            console.log("mpesaPay", error);
            next(error);
        }
    }
}

module.exports = new PaymentController();
