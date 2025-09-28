// import mongoose, { Document, Types, Schema } from "mongoose";
// import uniqueValidator from "mongoose-unique-validation";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import crypto from "crypto";
// import secret from "../config/index.js";

// const secretCode: any = secret.secret;
// interface IRecovery {
//     token?: string | null;
//     date?: Date | null;
// }

// interface IUser extends Document {
//     firstName: string;
//     lastName: string;
//     profilePhoto?: string;
//     password: string;
//     email: string;
//     role: string[];
//     customer?: Types.ObjectId;
//     cart?: Types.ObjectId;
//     deleted: boolean;
//     hash?: string;
//     salt?: string;
//     OTP?: number;
//     recovery: IRecovery;

//     // Métodos customizados
//     setPassword(password: string): Promise<void>;
//     validatePassword(password: string): boolean;
//     generateJWT(): string;
//     toAuthJSON(): {
//         _id: Types.ObjectId;
//         email: string;
//         firstName: string;
//         lastName: string;
//         role: string[];
//         token: string;
//     };
//     gerTokenRecoveryPass(): IRecovery;
//     finalTokenRecoveryPass(): IRecovery;
// }

// const UserSchema = new Schema<IUser>(
//     {
//         firstName: { type: String, required: [true, "Preencha o campo"] },
//         lastName: { type: String, required: [true, "Preencha o campo"] },
//         profilePhoto: { type: String },
//         password: {
//             type: String,
//             required: true,
//             minlength: [8, "Senha deve ter no mínimo 8 caracteres"],
//             match: [/[a-zA-Z0-9]/, "Senha deve conter letras e números"], // 👈 apenas uma regex
//         },
//         email: {
//             type: String,
//             required: [true, "Preencha o campo"],
//             unique: true,
//             lowercase: true,
//             index: true,
//             match: [/\S+@\S+\.\S+/, "Formato de email inválido"],
//         },
//         role: { type: [String], default: ["client"], required: true },
//         customer: {
//             type: Schema.Types.ObjectId,
//             ref: "Customer",
//         },
//         cart: {
//             type: Schema.Types.ObjectId,
//             ref: "Cart",
//         },
//         deleted: {
//             type: Boolean,
//             default: false,
//             required: true,
//         },
//         hash: String,
//         salt: String,
//         OTP: Number,
//         recovery: {
//             token: { type: String, default: null },
//             date: { type: Date, default: null },
//         },
//     },
//     { timestamps: true }
// );

// UserSchema.plugin(uniqueValidator, { message: "Email em uso, escolha outro" });

// // Métodos
// UserSchema.methods.setPassword = function (password: string) {
//     return new Promise<void>((resolve) => {
//         this.salt = bcrypt.genSaltSync(10);
//         this.password = bcrypt.hashSync(password, this.salt);
//         resolve();
//     });
// };

// UserSchema.methods.validatePassword = function (password: string): boolean {
//     return bcrypt.compareSync(password, this.password);
// };

// UserSchema.methods.generateJWT = function (): string {
//     const dateToday = new Date();
//     const dateExp = new Date(dateToday);
//     dateExp.setDate(dateToday.getDate() + 15);

//     return jwt.sign(
//         {
//             _id: this.id,
//             email: this.email,
//             firstName: this.firstName,
//             lastName: this.lastName,
//             dateExp: Math.floor(dateExp.getTime() / 1000),
//         },
//         secretCode
//     );
// };

// UserSchema.methods.toAuthJSON = function () {
//     return {
//         _id: this._id,
//         email: this.email,
//         firstName: this.firstName,
//         lastName: this.lastName,
//         role: this.role,
//         token: this.generateJWT(),
//     };
// };

// UserSchema.methods.gerTokenRecoveryPass = function () {
//     const tokenBuffer = crypto.randomBytes(32);
//     this.recovery = {
//         token: tokenBuffer.toString("hex").replace(/\W/g, ""),
//         date: new Date(Date.now() + 24 * 60 * 60 * 1000),
//     };
//     return this.recovery;
// };

// UserSchema.methods.finalTokenRecoveryPass = function () {
//     this.recovery = { token: null, date: null };
//     return this.recovery;
// };

// export default mongoose.model<IUser>("User", UserSchema, "users");
// /////////////////////// nome do model, nome do SChema, nome da coleção

export default {}