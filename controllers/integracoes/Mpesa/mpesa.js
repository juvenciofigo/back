const Transaction = require("./transaction")
// Classe para integração com a API Mpesa
class Mpesa {
    static init(api_key, public_key, ssl = true) {
        return new Transaction(api_key, public_key, ssl);
    }
}

module.exports = Mpesa;
