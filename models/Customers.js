const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CustomerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Preencha o campo user"],
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: [true, "Preencha o campo email"],
            unique: [true, "Email em uso, digite um email diferente"],
            lowercase: true,
            index: true,
            match: [/\S+@\S+\.\S+/, "Formato inválido"],
        },
        cellNumber: {
            type: String,
        },
        addresses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address",
            },
        ],
        deleted: { type: Boolean, default: false },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: [true, "Preencha o campo"],
        },
    },
    { timestamps: true }
);

CustomerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Customer", CustomerSchema, "customers");
