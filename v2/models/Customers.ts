import mongoose, { Schema, Document, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { cities, provinces } from "../helpers/options.js";

interface ICustomer extends Document {
    user: Types.ObjectId;
    city: string;
    province: string;
    cellNumber: string;
    addresses: [Types.ObjectId];
}

const CustomerSchema = new Schema<ICustomer>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Preencha o campo user"],
            unique: true,
        },
        city: {
            type: String,
            enum: cities,
            required: true,
        },
        province: {
            enum: provinces,
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

export default mongoose.model("Customer", CustomerSchema, "customers");
