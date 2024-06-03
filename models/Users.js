const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = require("../config").secret;
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
    {
        name: {
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
            unique: [true, "Email em uso, digite um email diferente"],
            lowercase: true,
            index: true,
            match: [/\S+@\S+\.\S+/, "Formato inválido"],
        },
        role: {
            type: [String],
            require: true,
            default: ["client"],
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
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
    return new Promise((resolve, reject) => {
        this.salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(password, this.salt);
        resolve();
    });
};

UserSchema.methods.validPass = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.tokenGer = function () {
    const dateToday = new Date();
    const dateExp = new Date(dateToday);
    dateExp.setDate(dateToday.getDate() + 15);

    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            name: this.name,
            dateExp: parseFloat(dateExp.getTime() / 1000, 10),
        },
        secret
    );
};

UserSchema.methods.sendAuthJson = function () {
    return {
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role,
        token: this.tokenGer(),
    };
};

// recovery
UserSchema.methods.gerTokenRecoveryPass = function () {
    this.recovery = {};
    const tokenBuffer = crypto.randomBytes(32);
    this.recovery.token = tokenBuffer.toString("hex").replace(/\W/g, "");
    this.recovery.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    return this.recovery;
};

UserSchema.methods.finalTokenRecoveryPass = function () {
    this.recovery = { token: null, date: null };
    return this.recovery;
};

module.exports = mongoose.model("User", UserSchema, "users");
/////////////////////// nome do mode, nome do SChema, nome da coleção
