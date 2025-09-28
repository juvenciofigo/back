import mongoose, { Schema, Document, Types } from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discountType: {
            type: String,
            enum: ["percentual", "fixo"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        usageLimit: {
            type: Number,
            default: 1,
        },
        usedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Coupon", CouponSchema, "coupons");
