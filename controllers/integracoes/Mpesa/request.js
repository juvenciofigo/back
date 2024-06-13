const { response } = require("express");
const Cryptor = require("./cryptor");
const axios = require("axios");

// Classe para fazer requisições HTTP
class Request {
    constructor(api_key, public_key, ssl = true) {
        this.ssl = ssl;
        this.public_key = public_key;
        this.api_key = api_key;
    }

    async get(url, params) {
        const headers = {
            "Content-Type": "application/json",
            Origin: "*",
            Authorization: "Bearer " + Cryptor.token(this.public_key, this.api_key),
        };
        try {
            const response = await axios.get(url, {
                params,
                headers,
            });

            return {
                status: response.status,
                statusText: response.data,
                data: response.data,
            };
        } catch (error) {
            if (typeof error.response.data !== "undefined") {
                return {
                    status: error.response.status,
                    statusText: error.response.data,
                    data: error.response.data,
                };
            }
            throw new Error(error);
        }
        throw new Error("Failed to process request");
    }

    async post(url, params) {
        const length = JSON.stringify(params).length || 0;
        const headers = {
            "Content-Length": length,
            "Content-Type": "application/json",
            Origin: "developer.mpesa.vm.co.mz",
            Authorization: "Bearer " + Cryptor.token(this.public_key, this.api_key),
        };

        try {
            const response = await axios.post(url, params, {
                headers,
            });

            return {
                status: response.status,
                statusText: response.data,
                data: response.data,
            };
        } catch (error) {
            if (error.code.toLowerCase() === "enotfound") {
                return { error: "Erro ao efectuar pagamento." };
            } else if (error.response.data && typeof error.response.data !== "undefined") {
                return {
                    status: error.response.status,
                    statusText: error.response.data,
                    data: error.response.data,
                };
            }
            throw new Error(error);
        }
        throw new Error("Failed to process request");
    }

    async put(url, params) {
        const length = JSON.stringify(params).length || 0;
        const headers = {
            "Content-Length": length,
            "Content-Type": "application/json",
            Origin: "*",
            Authorization: "Bearer " + Cryptor.token(this.public_key, this.api_key),
        };
        try {
            const response = await axios.put(url, params, {
                headers,
            });

            return {
                status: response.status,
                statusText: response.data,
                data: response.data,
            };
        } catch (error) {
            if (typeof error.response.data !== "undefined") {
                return {
                    status: error.response.status,
                    statusText: error.response.data,
                    data: error.response.data,
                };
            }
            throw new Error(error);
        }
        throw new Error("Failed to process request");
    }
}
const respose = {
    status: 408,
    statusText: "Request Timeout",

    data: {
        output_ResponseCode: "INS-9",
        output_ResponseDesc: "Request timeout",
        output_TransactionID: "N/A",
        output_ConversationID: "3990dfa203b54c38b312f5f00df394e7",
        output_ThirdPartyReference: "171815059",
    },
};

const data = {
    output_ResponseCode: "INS-9",
    output_ResponseDesc: "Request timeout",
    output_TransactionID: "N/A",
    output_ConversationID: "3990dfa203b54c38b312f5f00df394e7",
    output_ThirdPartyReference: "171815059",
};
module.exports = Request;
