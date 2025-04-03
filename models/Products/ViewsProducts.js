const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const options = require("../../helpers/options");

const ViewsProcustsSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        divice: {
            type: String,
        },
        location: {
            country: {
                type: String,
                default: "Moçambique",
            },
            pronvince: {
                type: String,
                enum: options.provinces,
            },
        },
        referrer: {
            type: String,
        },
    },
    { timestamps: true }
);

ViewsProcustsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("ViewsProcucts", ViewsProcustsSchema, "viewsProcucts");
