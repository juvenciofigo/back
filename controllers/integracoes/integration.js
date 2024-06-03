// Chaves de API e configurações SSL
const api_key = process.env.API_KEY;
const public_key = process.env.PUBLIC_KEY;
const ssl = process.env.SSL;

// Inicialização e criação do objeto Mpesa
const Mpesa = require("./Mpesa/mpesa");
const mpesa = Mpesa.init(api_key, public_key, ssl);

// Controlador para pagamentos
class PaymentController {
    async mpesaPay(req, res, next) {
        const data = req.body;
        try {
            const response = await mpesa.c2b(data);
            res.json(response);
            return;
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentController();
