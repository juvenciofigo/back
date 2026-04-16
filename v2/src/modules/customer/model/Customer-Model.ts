import { Schema, model, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ICustomer } from "../index.js"

const CustomerSchema = new Schema<ICustomer>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true,
        },
        nationality: {
            type: String,
            required: true,
        },
        profilePhoto: {
            type: String
        },
        gender: {
            type: String,
        },
        birthDate: {
            type: Date,
        },
        addresses: [
            {
                type: Schema.Types.ObjectId,
                ref: "Address",
            },
        ],
        deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

CustomerSchema.plugin(mongoosePaginate);

export const CustomerModel = model<ICustomer, PaginateModel<ICustomer>>("Customer", CustomerSchema, "customers");
