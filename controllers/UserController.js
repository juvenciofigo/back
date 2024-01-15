require("../models/Users");
const { json } = require("body-parser");
const mongoose = require("../database/connection");
const error = require("mongoose/lib/error");
const Users = mongoose.model("User");
// const sendEmailRecovery = require("../helpers/email-recovery")

class UserController {
    // Show Details
    async getUserDetails(req, res, next) {
        try {
            const user = await Users.findById(req.params.id).populate({ path: "loja" });

            if (!user) return res.status(404).json({ msg: "Usuário não encontrado!" });

            return res.status(200).json(user);
        } catch (error) {
            console.log(error);

            if (error.name === "CastError") return res.status(400).json({ msg: "ID de usuário inválido!!" });

            return res.status(500).json({ msg: "Erro ao obter detalhes do usuário.!" });
        }
    }

    // Save user

    async createUser(req, res) {
        const { username, email, password } = req.body;
        try {
            if (!username || !email || !password) return res.status(422).json({ errors: "Preencha todos os campos" });

            const user = await Users.create({ username, email });
            user.setPass(password);
            user.save();
            res.json({ user: user.sendAuthJson() });
        } catch (error) {
            console.error(error);
            return res.status(400).json(error);
        }
    }

    // Update user
    async updateUser(req, res) {
        const { username, email, password } = req.body;
        try {
            const user = await Users.findById(req.payload._id);

            if (!user) return res.status(404).json({ msg: "Usuário não encontrado!" });

            if (typeof username !== "undefined") user.username = username;
            if (typeof password !== "undefined") user.setPass(password);
            if (typeof email !== "undefined") user.email = email;

            const updateduser = await user.save();

            return res.status(200).json({ user: updateduser.sendAuthJson(), msg: "Usuário atualizada!" });
        } catch (error) {
            console.log(error);

            if (error.name === "CastError") return res.status(400).json({ msg: "ID de usuário inválido!!" });

            return res.status(500).json({ msg: "Erro ao obter detalhes do usuário.!" });
        }
    }

    // Delete user

    async deleteUser(req, res) {
        try {
            const user = await Users.findById(req.payload._id);

            if (!user) return res.status(404).json({ msg: "Usuário não encontrado!" });
            await user.remove();
            return res.status(200).json({ delete: true });
        } catch (error) {
            console.error(error);

            return res.status(500).json({ success: false, message: "Erro ao excluir usuário!" });
        }
    }

    // Login
    async authenticateUser(req, res) {
        const { email, password } = req.body;
        try {
            if (!email) return res.status(422).json({ errors: { email: "não pode ficar vazio" } });

            if (!password) return res.status(422).json({ errors: { password: "não pode ficar vazio" } });

            const user = await Users.findOne({ email: email });
            if (!user) return res.status(404).json({ msg: "Usuário não encontrado!" });
            if (!user.validPass(password)) return res.status(401).json({ errors: "Senha inválida" });
            return res.json({ user: user.sendAuthJson() });
        } catch (error) {
            console.log(error);

            if (error.name === "ValidationError") {
                return res.status(422).json({ errors: error.errors });
            }

            return res.status(500).json({ msg: "Erro ao autenticar o usuário" });
        }
    }

    // Show all
    async getAllUsers(req, res) {
        try {
            const users = await Users.find();
            if (users) {
                console.log(users);
                return res.status(200).json(users);
            }
            throw new Error("error");
        } catch (error) {
            console.log(error);
        }
    }

    // RECOVERY

    //
    async showRecovery(req, res) {
        return res.render("recovery", { error: null, success: null });
    }

    //
    async initiateRecovery(req, res) {
        const { email } = req.body;
        try {
            if (!email) return res.render("recovery", { error: "Preencha com o seu email", success: null });

            const user = await Users.findOne({ email });

            if (!user) return res.render("recovery", { error: "Não existe usuário com este email", success: null });

            await user.gerTokenRecoveryPass();
            user.save();
            return res.render("recovery", { error: null, success: true });
        } catch (error) {
            console.error(error);

            return res.status(500).json({ msg: "Erro ao iniciar a recuperação de senha." });
        }
    }
    async completeRecovery(req, res) {
        const token = req.query.token;

        try {
            if (!token) return res.render("recovery", { error: "Token não identificado", success: null });

            const user = await Users.findOne({ "recovery.token": token });
            if (!user) return res.render("recovery", { error: "Não existe usuário com este token", success: null });

            if (new Date(user.recovery.date) < new Date()) return res.render("recovery", { error: "Token expirado", success: null });

            return res.render("recovery/store", { error: null, success: null, token: token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Erro ao completar a recuperação de senha. Por favor, tente novamente." });
        }
    }

    async completeRecovery(req, res) {
        const { token, password } = req.body;
        try {
            if (!token || !password) {
                return res.render("recovery/store", { error: "Preencha novamente com a sua senha", success: null, token: token });
            }

            const user = await Users.findOne({ "recovery.token": token });
            if (!user) {
                return res.render("recovery", { error: "Usuário não identificado", success: null });
            }

            user.finalTokenRecoveryPass();
            user.setPass(password);
            user.save();

            return res.render("recovery/store", { error: null, success: "Senha alterada com sucesso", token: null });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Erro ao completar a recuperação de senha. Por favor, tente novamente." });
        }
    }
}
module.exports = new UserController();
