// Chaves de API e configurações SSL
const api_key = process.env.API_KEY;
const public_key = process.env.PUBLIC_KEY;
const ssl = process.env.SSL;

// Inicialização e criação do objeto Mpesa
const Mpesa = require("./integracoes/Mpesa/mpesa");
const mpesa = Mpesa.init(api_key, public_key, ssl);
const Orders = require("../models/Orders");
const Payments = require("../models/Payments");

// Controlador para pagamentos
class PaymentController {
    async mpesaPay(req, res, next) {
        const { client_number, orderId } = req.body;

        try {
            if (!orderId) {
                return res.status(400).json({ message: "Falha no pagamento." });
            }

            const order = await Orders.findById(orderId).populate("payment");
            console.log(order.payment._id);
            if (!order) {
                return res.status(404).json({ message: "Pedido não encontrado!." });
            }
            if (order.payment.status !== "Esperando") {
                return res.status(404).json({ message: `Os estado do pedido é ${order.payment.status}` });
            }
            const data = {
                client_number,
                value: order.payment.amount,
                third_party_reference: order.referenceOrder,
                transaction_reference: order.referenceOrder,
            };

            const response = await mpesa.c2b(data);

            async function responseClient(data) {
                switch (data.output_ResponseCode) {
                    case "INS-0":
                        return "Pagamento efectuado.";
                        break;

                    case "INS-4":
                        return "Número fora de área.";
                        break;

                    case "INS-6":
                        return "Falha na transação.";
                        break;

                    case "INS-9":
                        return "Tempo limite da solicitação.";
                        break;

                    case "INS-15":
                        return "Valor inválido usado.";
                        break;

                    case "INS-995":
                        return "Perfil do cliente tem problemas.";
                        break;

                    case "INS-2006":
                        return "Saldo insuficiente.";
                        break;

                    case "INS-2051":
                        return "Número inválido.";
                        break;

                    case "INS-10":
                        return "Trasanção duplicada.";
                        break;

                    default:
                        return "Erro.";
                        break;
                }
            }

            const client_response = await responseClient(response.data);
            if (response.status === 200 || response.status === 201) {
                const payment = await Payments.findById(order.payment._id);
                console.log("ïniciado", payment);

                payment.paymentDate = Date.now();
                payment.paymentMethod = "Mpesa";
                payment.status = "Pago";
                payment.transactionId = response.data.output_TransactionID;
                payment.reference = response.data.output_ThirdPartyReference;
                payment.number = client_number;
                console.log("pagamento feito");
                await payment.save();
            }
            return res.status(response.status).json({ message: client_response });
        } catch (error) {
            console.log("mpesaPay", error);
            next(error);
        }
    }
}
// sucess
const sucess = {
    status: 201,
    statusText: {
        output_ResponseCode: "INS-0",
        output_ResponseDesc: "Request processed successfully",
        output_TransactionID: "t93g5tcdhi82",
        output_ConversationID: "47a5eaf574fa4902b49694df4d70dfd0",
        output_ThirdPartyReference: "1718152331020",
    },
    data: {
        output_ResponseCode: "INS-0",
        output_ResponseDesc: "Request processed successfully",
        output_TransactionID: "t93g5tcdhi82",
        output_ConversationID: "47a5eaf574fa4902b49694df4d70dfd0",
        output_ThirdPartyReference: "1718152331020",
    },
};
// erro
const erro = {
    status: 409,
    statusText: {
        output_ResponseCode: "INS-10",
        output_ResponseDesc: "Duplicate Transaction",
        output_TransactionID: "N/A",
        output_ConversationID: "7e81b74046104716afc05daa743b1c35",
        output_ThirdPartyReference: "1718152331020",
    },
    data: {
        output_ResponseCode: "INS-10",
        output_ResponseDesc: "Duplicate Transaction",
        output_TransactionID: "N/A",
        output_ConversationID: "7e81b74046104716afc05daa743b1c35",
        output_ThirdPartyReference: "1718152331020",
    },
};

module.exports = new PaymentController();

// in
// {
//     "input_TransactionReference": "T12344C",
//     "input_CustomerMSISDN": "258840657153",
//     "input_Amount": "10",
//     "input_ThirdPartyReference": "OK2E4W",
//     "input_ServiceProviderCode": "171717"
//   }
//   //////////
//   in
//   {
//   "input_TransactionReference": "T12344C",
//   "input_CustomerMSISDN": "258840657153",
//   "input_Amount": "10",
//   "input_ThirdPartyReference": "OK2E4W",
//   "input_ServiceProviderCode": "171717"}
// out
// {'output_ConversationID': '51e5a17e54fe487d9317fa3071502a21',
//  'output_ResponseCode': 'INS-0',
//  'output_ResponseDesc': 'Request processed successfully',
//  'output_ThirdPartyReference': 'OK2E4W',
//  'output_TransactionID': 'n91sx51w6wis'}

// /////////////////
// in
// {
//     "input_TransactionReference": "T12344C",
//     "input_CustomerMSISDN": "258840657153",
//     "input_Amount": "10",
//     "input_ThirdPartyReference": "FPMB5X",
//     "input_ServiceProviderCode": "171717"}
//   out
//   {'output_ConversationID': 'f27b749d87d14c4b80d04e82f9d7e708',
//  'output_ResponseCode': 'INS-0',
//  'output_ResponseDesc': 'Request processed successfully',
//  'output_ThirdPartyReference': 'FPMB5X',
//  'output_TransactionID': 'cisnyrmyrv3v'}
