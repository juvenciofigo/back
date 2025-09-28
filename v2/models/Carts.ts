// import mongoose, { Document, Types, Schema } from "mongoose";

// interface IItem {
//     productId: Types.ObjectId;
//     quantity: number;
//     deliveryEstimate: Types.ObjectId;
//     variation: {
//         type: {
//             color: Types.ObjectId;
//             model: Types.ObjectId;
//             size: Types.ObjectId;
//             material: Types.ObjectId;
//         };
//     };
//     item: Types.ObjectId;
// }

// interface ICart extends Document {
//     cartItens: [IItem];
//     cartUser: Types.ObjectId;
// }

// const CartSchema = new Schema<ICart>(
//     {
//         cartItens: [
//             {
//                 productId: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "Products",
//                     required: true,
//                 },
//                 quantity: {
//                     type: Number,
//                     default: 1,
//                     required: true,
//                 },
//                 deliveryEstimate: {
//                     type: mongoose.Schema.Types.ObjectId,
//                 },
//                 variation: {
//                     type: {
//                         color: {
//                             type: mongoose.Schema.Types.ObjectId,
//                             ref: "Variation",
//                         },
//                         model: {
//                             type: mongoose.Schema.Types.ObjectId,
//                             ref: "Variation",
//                         },
//                         size: {
//                             type: mongoose.Schema.Types.ObjectId,
//                             ref: "Variation",
//                         },
//                         material: {
//                             type: mongoose.Schema.Types.ObjectId,
//                             ref: "Variation",
//                         },
//                     },
//                 },
//                 item: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     default: () => new mongoose.Types.ObjectId(),
//                     unique: true,
//                     sparse: true,
//                 },
//             },
//         ],
//         cartUser: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//     },
//     { timestamps: true, _id: true }
// );

// export default mongoose.model("Cart", CartSchema, "carts");
export default {}