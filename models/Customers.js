const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CustomerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Preencha o campo"],
        },
        name: { type: String, required: true },
        email: {
            type: String,
            required: [true, "Preencha o campo"],
            unique: [true, "Email em uso, digite um email diferente"],
            lowercase: true,
            index: true,
            match: [/\S+@\S+\.\S+/, "Formato inválido"],
        },
        contacts: { type: String },
        address: {
            address: { type: String },
            city: { type: String },
            country: { type: String },
            province: { type: String },
            reference: { type: String },
        },
        deleted: { type: Boolean, default: false },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
        },
    },
    { timestamps: true }
);

CustomerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Customer", CustomerSchema, "customers");
