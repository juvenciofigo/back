import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IAddress } from "./address-model-interface.js";

const AddressSchema = new Schema<IAddress>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        complete: {
            type: String,
            required: true,
        },
        city: {
            type: Schema.Types.ObjectId,
            ref: "City",
            required: true,
        },
        province: {
            type: Schema.Types.ObjectId,
            ref: "Province",
            required: true,
        },
        neighborhood: {
            type: Schema.Types.ObjectId,
            ref: "Neighborhood",
            required: true,
        },
        reference: {
            type: String,
        },
        cellNumber: {
            type: String,
            required: true,
        },
        note: {
            type: String,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

AddressSchema.plugin(mongoosePaginate);

export const AddressModel = mongoose.model<IAddress, PaginateModel<IAddress>>("Address", AddressSchema, "addresses");
