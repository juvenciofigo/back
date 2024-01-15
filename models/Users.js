const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = require("../config").secret;
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Preencha o campo"],
            min: [6, "Nome Do Usuário deve ter no minimo 6 letras"],
        },
        password: {
            type: String,
            required: true,
            min: [6, "Senha deve ter no minimo 6 letras"],
        },
        email: {
            type: String,
            required: [true, "Preencha o campo"],
            unique: true,
            lowercase: true,
            index: true,
            match: [/\S+@\S+\.\S+/, "Formato inválido"],
        },
        endereco: {
            rua: { type: String },
            cidade: { type: String },
            estado: { type: String },
            cep: { type: String },
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: [true, "Preencha o campo"],
        },
        permition: {
            type: Array,
            require: true,
            default: ["cliente"],
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
        },
        hash: String,
        salt: String,
        recovery: {
            type: {
                token: String,
                date: Date,
            },
            default: {},
        },
    },
    { timestamps: true } // colaca um campo com da data da criacao e data de actulizacao
);

UserSchema.plugin(uniqueValidator, { message: "nome de usuário sendo usado, escolha outro" }); // validacao do nome de usuário

UserSchema.methods.setPass = function (password) {
    this.salt = bcrypt.genSaltSync(16);
    var hash = bcrypt.hashSync(password, this.salt);
};

UserSchema.methods.validPass = function (password) {
    var hash = bcrypt.compareSync(password, this.hash);
    return hash === this.hash;
};

UserSchema.methods.tokenGer = function () {
    var dateToday = new Date();
    var dateExp = new Date(today);

    dateExp.setDate(today.getDate() + 15);

    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            exp: exp.getTime() / 1000,
        },
        secret
    );
};

UserSchema.methods.sendAuthJson = function () {
    return {
        _id: this._id,
        email: this.email,
        username: this.username,
        store: this.store,
        role: this.permition,
    };
};

// recovery
UserSchema.methods.gerTokenRecoveryPass = function () {
    this.recovery = {};
    const tokenBuffer = crypto.randomBytes(32);
    this.recovery.token = tokenBuffer.toString("hex");
    this.recovery.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
}


UserSchema.methods.finalTokenRecoveryPass = function () {
    this.recovery = { token: null, date: null };
    return this.recovery;
};

module.exports = mongoose.model("User", UserSchema, "users");
