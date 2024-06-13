const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },
        message: {
            type: String,
            required: true,
        },
        read: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema, "notifications");
