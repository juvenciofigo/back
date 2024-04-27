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
            const request = await axios.get(url, {
                params,
                headers,
            });
            return {
                status: request.status,
                data: request.data,
            };
        } catch (error) {
            if (typeof error.response.data !== "undefined") {
                return {
                    status: error.response.status,
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
            const request = await axios.post(url, params, {
                headers,
            });

            return {
                status: request.status,
                data: request.data,
            };
        } catch (error) {
            if (typeof error.response.data !== "undefined") {
                return {
                    status: error.response.status,
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
            const request = await axios.put(url, params, {
                headers,
            });
            return {
                status: request.status,
                data: request.data,
            };
        } catch (error) {
            if (typeof error.response.data !== "undefined") {
                return {
                    status: error.response.status,
                    data: error.response.data,
                };
            }
            throw new Error(error);
        }
        throw new Error("Failed to process request");
    }
}

module.exports = Request;
