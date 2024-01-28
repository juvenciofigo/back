const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderRouterSchema = new mongoose.Schema(
    {
        customerOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        Ordercart: {
            type: [
                {
                    productOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                    variationOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Variation", required: true },
                    staticProduct: { type: String },
                    quantityOrder: { type: Number, default: 1 },
                    priceUnit: { type: Number, default: 1 },
                },
            ],
        },
        paymentOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            required: true,
        },
        deliveryOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Delivery",
            required: true,
        },
        orderCancel: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

OrderRouterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", OrderRouterSchema, "orders");
