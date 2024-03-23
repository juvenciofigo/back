const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderSchema = new mongoose.Schema(
    {
        customerOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        Ordercart: {
            type: [
                // { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },

                {
                    picture: { type: String },
                    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                    productName: { type: String },
                    productPrice: { type: Number },
                    quantity: { type: Number },
                    subtotal: { type: Number },
                    // variation: { type: mongoose.Schema.Types.ObjectId, ref: "Variation", required: true },
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

OrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", OrderSchema, "orders");
