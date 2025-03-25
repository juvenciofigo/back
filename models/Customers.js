const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const options = require("../helpers/options");

const CustomerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Preencha o campo user"],
            unique: true,
        },
        city: {
            enum: options.cities,
            type: String,
            required: true,
        },
        province: {
            enum: options.provinces,
            type: String,
            required: true,
        },
        cellNumber: {
            type: String,
            required: [true, "Adicione o seu número"],
        },
        addresses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address",
            },
        ],
    },
    { timestamps: true }
);

CustomerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Customer", CustomerSchema, "customers");
