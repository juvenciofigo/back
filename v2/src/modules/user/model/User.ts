import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validation";
import crypto from "crypto";
import { IUser } from "../index.js";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = new Schema<IUser>(
    {
        password: {
            type: String,
            required: true,
            minlength: [8, "Senha deve ter no mínimo 8 caracteres"],
            match: [/[a-zA-Z0-9]/, "Senha deve conter letras e números"], // 👈 apenas uma regex
        },
        email: {
            type: String,
            required: [true, "Preencha o campo"],
            unique: true,
            lowercase: true,
            index: true,
            match: [/\S+@\S+\.\S+/, "Formato de email inválido"],
        },
        role: { type: [String], default: ["client"], required: true },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: "Cart",
        },
        deleted: {
            type: Boolean,
            default: false,
            required: true,
        },
        hash: String,
        salt: String,
        OTP: Number,
        recovery: {
            token: { type: String, default: null },
            date: { type: Date, default: null },
        },
    },
    { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "Email em uso, escolha outro" });
UserSchema.plugin(mongoosePaginate);
// Métodos

UserSchema.methods.gerTokenRecoveryPass = function () {
    const tokenBuffer = crypto.randomBytes(32);
    this.recovery = {
        token: tokenBuffer.toString("hex").replace(/\W/g, ""),
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    return this.recovery;
};

UserSchema.methods.finalTokenRecoveryPass = function () {
    this.recovery = { token: null, date: null };
    return this.recovery;
};

export const UserModel = mongoose.model<IUser, mongoose.PaginateModel<IUser>>("User", UserSchema, "users");
// nome do model, nome do SChema, nome da coleção
