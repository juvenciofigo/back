const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = require("../config").secret;
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Preencha o campo"],
        },
        lastName: {
            type: String,
            required: [true, "Preencha o campo"],
        },
        profilePhoto: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            min: [8, "Senha deve ter no minimo 6 letras"],
            match: [/[a-z]/, "A senha deve conter pelo menos uma letra minúscula", /[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula", /\d/, "A senha deve conter pelo menos um número"],
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
        deleted: {
            type: Boolean,
            default: false,
            required: true,
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
    { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "nome de usuário sendo usado, escolha outro" });

UserSchema.methods.setPassword = function (password) {
    return new Promise((resolve, reject) => {
        this.salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(password, this.salt);
        resolve();
    });
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
    const dateToday = new Date();
    const dateExp = new Date(dateToday);
    dateExp.setDate(dateToday.getDate() + 15);

    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            dateExp: parseFloat(dateExp.getTime() / 1000, 10),
        },
        secret
    );
};

UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
        token: this.generateJWT(),
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
/////////////////////// nome do model, nome do SChema, nome da coleção
