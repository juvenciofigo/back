const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CategorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, required: true },
        code: { type: String, required: true },
        availability: { type: Boolean, default: true },
        products: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }] }
    },
    { timestamps: true }
);

CategorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Category", CategorySchema, "categories");

