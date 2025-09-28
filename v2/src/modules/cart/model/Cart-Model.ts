import mongoose, { Schema } from "mongoose";
import { ICart } from "./cart-interface-model.js";

const CartSchema = new Schema<ICart>(
    {
        cartItens: {
            default: [],
            type: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Products",
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        default: 1,
                        required: true,
                    },
                    deliveryEstimate: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    variation: {
                        type: {
                            color: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Variation",
                            },
                            model: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Variation",
                            },
                            size: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Variation",
                            },
                            material: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "Variation",
                            },
                        },
                    },
                    item: {
                        type: mongoose.Schema.Types.ObjectId,
                        default: () => new mongoose.Types.ObjectId(),
                        unique: true,
                        sparse: true,
                    },
                },
            ],
        },
        cartUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, _id: true }
);

export const CartModel = mongoose.model("Cart", CartSchema, "carts");
