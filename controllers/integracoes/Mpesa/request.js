const Cryptor = require("./cryptor");
const axios = require("axios");

// Classe para fazer requisições HTTP
class Request {
    constructor(api_key, public_key, ssl = true) {
        this.ssl = ssl;
        this.public_key = public_key;
        this.api_key = api_key;
    }

    generateHeaders(origin = "*") {
        return {
            "Content-Type": "application/json",
            Origin: origin,
            Authorization: "Bearer " + Cryptor.token(this.public_key, this.api_key),
        };
    }

    responseClient(data) {
        const messages = {
            "INS-0": "Pagamento efectuado.",
            "INS-4": "Número fora de área.",
            "INS-5": "Transação cancelada pelo cliente.",
            "INS-6": "Falha na transação.",
            "INS-9": "Tempo limite da solicitação.",
            "INS-13": "Código inválido.",
            "INS-15": "Valor inválido usado.",
            "INS-19": "Referência de terceiros inválida.",
            "INS-23": "Status desconhecido. Entre em contato com o Suporte da M-Pesa.",
            "INS-995": "Perfil do cliente tem problemas.",
            "INS-2006": "Saldo insuficiente.",
            "INS-2051": "Número inválido.",
            "INS-10": "Transação duplicada.",
        };
        return messages[data] || "Erro no pagamento.";
    }

    convertMessage(data = {}) {
        return {
            status: data.status,
            output_ResponseCode: data.output_ResponseCode ?? "N/A",
            output_ResponseDesc: this.responseClient(data.output_ResponseCode),
            output_TransactionID: data.output_TransactionID ?? "N/A",
            output_ConversationID: data.output_ConversationID ?? "N/A",
            output_ThirdPartyReference: data.output_ThirdPartyReference ?? "N/A",
        };
    }

    async get(url, params) {
        try {
            const response = await axios.get(url, {
                params,
                headers: this.generateHeaders(),
            });

            return {
                ...this.convertMessage({ ...response.data, status: response.status }),
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async post(url, params) {
        
        try {
            const response = await axios.post(url, params, {
                headers: this.generateHeaders("developer.mpesa.vm.co.mz"),
            });
            
            
            return {
                ...this.convertMessage({ ...response.data, status: response.status }),
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async put(url, params) {
        try {
            const response = await axios.put(url, params, {
                headers: this.generateHeaders(),
            });

            return {
                ...this.convertMessage({ ...response.data, status: response.status }),
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(error) {
        if (["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT"].includes(error.code?.toUpperCase())) {
            return { error: "Erro ao efectuar pagamento. Verifique sua conexão." };
        }
        if (error.response?.data) {
            return {
                ...this.convertMessage({ ...error.response.data, status: error.response.status }),
            };
        }
        return { error: "Erro desconhecido ao processar a requisição." };
    }
}

module.exports = Request;
