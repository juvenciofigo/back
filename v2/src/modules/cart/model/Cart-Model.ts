import mongoose, { PaginateModel, Schema, model } from "mongoose";
import { ICart } from "./cart-interface-model.js";
import mongoosePaginate from "mongoose-paginate-v2";

const CartSchema = new Schema<ICart>(
    {
        cartItens: {
            default: [],
            type: [
                {
                    productId: {
                        type: Schema.Types.ObjectId,
                        ref: "Products",
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        default: 1,
                        required: true,
                    },
                    deliveryEstimate: {
                        type: Schema.Types.ObjectId,
                    },
                    variation: {
                        type: {
                            color: {
                                type: Schema.Types.ObjectId,
                                ref: "Variation",
                            },
                            model: {
                                type: Schema.Types.ObjectId,
                                ref: "Variation",
                            },
                            size: {
                                type: Schema.Types.ObjectId,
                                ref: "Variation",
                            },
                            material: {
                                type: Schema.Types.ObjectId,
                                ref: "Variation",
                            },
                        },
                    },
                    item: {
                        type: Schema.Types.ObjectId,
                        default: () => new mongoose.Types.ObjectId(),
                        unique: true,
                        sparse: true,
                    },
                },
            ],
        },
        cartUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, _id: true }
);

CartSchema.plugin(mongoosePaginate);

export const CartModel = model<ICart, PaginateModel<ICart>>("Cart", CartSchema, "carts");
