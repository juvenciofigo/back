const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const DeliveryRouterSchema = new mongoose.Schema(
    {
        deliveryStatus: { type: String, required: true },
        deliveryCodeTrack: { type: String },
        deliveryType: { type: String, required: true },
        deliveryCost: { type: Number, required: true },
        deliveryDeadline: { type: Number, required: true },
        deliveryOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        payload: { type: Object },
    },
    { timestamps: true }
);

DeliveryRouterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Delivery", DeliveryRouterSchema, "deliveries");
