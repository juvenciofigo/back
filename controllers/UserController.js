var Users = require("../models/Users");
var sendEmailRecovery = require("../helpers/email-recovery");
const { UserValidator } = require("./validations/userValidation");

class UserController {
    // Show all
    async getAllUsers(req, res) {
        try {
            var users = await Users.find().select("-recovery -salt -password");
            if (users) {
                console.log(users);
                return res.status(200).json({ count: users.length, users });
            }
            throw new Error("error");
        } catch (error) {
            console.log(error);
        }
    }

    // Show Details
    async getUserDetails(req, res) {
        const id = req.params.id;
        try {
            var user = await Users.findById(id).select("-recovery -salt -password");

            if (!user) return res.status(404).json({ msg: "Usuário não encontrado!" });

            return res.status(200).json(user);
        } catch (error) {
            console.log(error);

            return res.status(500).json({ msg: "Erro ao obter detalhes do usuário.!" });
        }
    }

    // Save user

    async createUser(req, res) {
        var { name, email, password } = req.body;

        try {
            const emailLowerCase = email.toLowerCase();

            // Verificar se o e-mail já está em uso em Users
            const existingUser = await Users.findOne({ email: emailLowerCase });

            if (existingUser) {
                return res.status(422).json({ error: "E-mail já em uso. Escolha outro", success: false });
            }

            var user = new Users({ name, email: emailLowerCase });
            await user.setPass(password);
            await user.save();

            res.json({ user: user.sendAuthJson(), success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }

    // Update user

    async updateUser(req, res) {
        var { name, email, password } = req.body;
        console.log(req.body);
        try {
            const emailLowerCase = email.toLowerCase();

            var user = await Users.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ msg: "Usuário não encontrado!", success: false });
            }

            if (typeof name !== "undefined") {
                user.name = name;
            }

            if (typeof password !== "undefined") {
                await user.setPass(password);
            }

            if (typeof email !== "undefined") {
                user.email = emailLowerCase;
            }

            var updatedUser = await user.save();

            return res.status(200).json({ user: updatedUser.sendAuthJson(), success: true, msg: "Usuário atualizado!" });
        } catch (error) {
            console.log(error);

            if (error.name === "CastError") {
                return res.status(400).json({ success: false, msg: "ID de usuário inválido!" });
            }

            return res.status(500).json({ success: false, msg: "Erro ao obter detalhes do usuário." });
        }
    }

    // Delete user

    async deleteUser(req, res) {
        try {
            var user = await Users.findById(req.params.id);

            if (!user) return res.status(404).json({ success: false, msg: "Usuário não encontrado!" });

            await user.deleteOne();

            return res.status(200).json({ msg: "usuário removido", success: true });
        } catch (error) {
            console.error(error);

            return res.status(500).json({ success: false, message: "Erro ao excluir usuário!" });
        }
    }

    // Login
    async authenticateUser(req, res) {
        var { email, password } = req.body;
        try {
            const emailLowerCase = email.toLowerCase();

            var user = await Users.findOne({ email: emailLowerCase });

            if (!user) return res.status(404).json({ success: false, error: "Usuário não encontrado! Verifique o  email" });

            if (!user.validPass(password)) {
                return res.status(401).json({ success: false, error: "Senha inválida" });
            }

            return res.json({ success: true, user: user.sendAuthJson() });
        } catch (error) {
            console.log(error);

            if (error.name === "ValidationError") {
                return res.status(422).json({ success: false, error: error.error });
            }

            return res.status(500).json({ success: false, msg: "Erro ao autenticar o usuário" });
        }
    }

    // RECOVERY

    //
    async showRecovery(req, res) {
        return res.render("recovery", { error: null, success: null });
    }

    //
    async initiateRecovery(req, res) {
        var { email } = req.body;

        try {
            const emailLowerCase = email.toLowerCase();

            if (!email) return res.render("recovery", { error: "Preencha com o seu email", success: false });

            var user = await Users.findOne({ email: emailLowerCase });

            if (!user) return res.render("recovery", { error: "Não existe usuário com este email", success: false });

            var recoveryData = await user.gerTokenRecoveryPass();
            user.save();

            sendEmailRecovery({ user, recovery: recoveryData }, (error, success) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ success: false, msg: "Erro ao enviar e-mail de recuperação de senha." });
                }

                return res.render("recovery", { error, success });
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({ success: false, msg: "Erro ao iniciar a recuperação de senha." });
        }
    }

    async GetCompleteRecovery(req, res) {
        var token = req.query.token;
        try {
            if (!token) return res.render("recovery", { error: "Token não identificado", success: null });

            var user = await Users.findOne({ "recovery.token": token });
            if (!user) return res.render("recovery", { error: "Não existe usuário com este token", success: null });

            if (new Date(user.recovery.date) < new Date()) return res.render("recovery", { error: "Token expirado", success: null });

            return res.render("recovery/store", { error: null, success: null, token: token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Erro ao completar a recuperação de senha. Por favor, tente novamente." });
        }
    }

    async completeRecovery(req, res) {
        var { token, password } = req.body;
        try {
            if (!token || !password) {
                return res.render("recovery/store", { error: "Preencha novamente com a sua senha", success: false, token: token });
            }

            var user = await Users.findOne({ "recovery.token": token });
            if (!user) {
                return res.render("recovery", { error: "Usuário não identificado", success: false });
            }

            user.finalTokenRecoveryPass();
            user.setPass(password);
            user.save();

            return res.render("recovery/store", { error: null, success: true, token: null });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, msg: "Erro ao completar a recuperação de senha. Por favor, tente novamente." });
        }
    }
}
module.exports = new UserController();
