const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validation");
const validator = require("validator");

const StoreSchema = new mongoose.Schema(
    {
        storeName: {
            type: String,
            required: true,
        },
        storeEmail: {
            type: String,
            validate: {
                validator: validator.isEmail,
                message: "O email fornecido não é válido.",
            },
        },
        cnpj: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value) => /\d{14}/.test(value),
                message: "CNPJ deve ter 14 dígitos numéricos.",
            },
        },
        contacts: {
            type: [String],
        },
        address: {
            type: {
                local: { type: String, required: true },
                numero: { type: String, required: true },
                complemento: { type: String },
                bairro: { type: String, required: true },
                cidade: { type: String, required: true },
                CEP: { type: String, required: true },
            },
            required: true,
        },
    },
    { timestamps: true }
);

StoreSchema.plugin(uniqueValidator, { message: "Esse {PATH} já está sendo usado, escolha outro." });

module.exports = mongoose.model("Store", StoreSchema, "stores");
