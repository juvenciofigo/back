const Users = require("../models/Users");
const Carts = require("../models/Carts");

const sendEmailRecovery = require("../helpers/email-recovery");

class UserController {
    /*
     Admin
    */

    // Show all
    async getAllUsers(req, res, next) {
        try {
            const users = await Users.find().select("-recovery -salt -password").populate(["cart"]);
            if (users) {
                return res.status(200).json({ count: users.length, users });
            }
            throw new Error("error");
        } catch (error) {
            next(error);
        }
    }

    /*
    Client
    */

    // Show Details
    async getUserDetails(req, res, next) {
        const authId = req.auth._id;
        const user = req.params.id;

        if (authId !== user) return res.status(400).json({ message: "Sem autorização!" });

        try {
            const userDetails = await Users.findById(user).select("-recovery -salt -password").populate("cart customer");
            if (userDetails.deleted === true) {
                return res.status(404).json({ message: "Conta apagada!" });
            }

            if (!userDetails) return res.status(404).json({ message: "Usuário não encontrado!" });

            return res.status(200).json(userDetails);
        } catch (error) {
            next(error);
        }
    }

    // Save user

    async createUser(req, res, next) {
        const { firstName, lastName, email, password } = req.body;

        try {
            const emailLowerCase = email.toLowerCase();

            // Verificar se o e-mail já está em uso em Users
            const existingUser = await Users.findOne({ email: emailLowerCase });

            if (existingUser) {
                return res.status(422).json({ message: "E-mail já em uso. Escolha outro", success: false });
            }

            const user = new Users({ firstName, lastName, email: emailLowerCase });
            await user.setPass(password);

            // Criar um carrinho vazio associado ao novo usuário
            const newCart = new Carts({ cartItens: [], cartUser: user._id });

            user.cart = newCart._id;
            await newCart.save();
            await user.save();
            res.json({ user: user.sendAuthJson(), success: true });
        } catch (error) {
            next(error);
        }
    }

    // Update user

    async updateUser(req, res, next) {
        const authId = req.auth._id;
        const user = req.params.id;

        if (authId !== user) return res.status(400).json({ message: "Sem autorização!" });

        const { firstName, lastName, email, password } = req.body;
        try {
            const emailLowerCase = email.toLowerCase();

            const user = await Users.findById(user);

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado!", success: false });
            }

            if (typeof firstName !== "undefined") {
                user.firstName = firstName;
            }
            if (typeof lastName !== "undefined") {
                user.lastName = lastName;
            }

            if (typeof password !== "undefined") {
                await user.setPass(password);
            }

            if (typeof email !== "undefined") {
                user.email = emailLowerCase;
            }

            const updatedUser = await user.save();

            return res.status(200).json({ user: updatedUser.sendAuthJson(), success: true, message: "Usuário atualizado!" });
        } catch (error) {
            next(error);
        }
    }

    // Delete user

    async deleteUser(req, res, next) {
        try {
            const user = await Users.findById(req.params.id);

            if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado!" });

            await user.deleteOne();

            return res.status(200).json({ message: "usuário removido", success: true });
        } catch (error) {
            next(error);
        }
    }

    // Login
    async authenticateUser(req, res, next) {
        const { email, password } = req.body;
        try {
            const emailLowerCase = email.toLowerCase();

            const user = await Users.findOne({ email: emailLowerCase });

            if (user.deleted === true) {
                return res.status(404).json({ message: "Conta apagada!" });
            }
            if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado! Verifique o  email" });

            if (!user.validPass(password)) {
                return res.status(401).json({ success: false, message: "Senha inválida" });
            }

            return res.status(200).json({ success: true, user: user.sendAuthJson() });
        } catch (error) {
            next(error);
        }
    }
    // default
    async default(req, res, next) {
        const { email, password } = req.body;
        try {
            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    // RECOVERY

    //
    async showRecovery(req, res, next) {
        return res.render("recovery", { error: null, success: null });
    }

    //
    async initiateRecovery(req, res) {
        const { email } = req.body;

        try {
            const emailLowerCase = email.toLowerCase();

            if (!email) return res.render("recovery", { message: "Preencha com o seu email", success: false });

            const user = await Users.findOne({ email: emailLowerCase });

            if (!user) return res.render("recovery", { message: "Não existe usuário com este email", success: false });

            const recoveryData = await user.gerTokenRecoveryPass();
            user.save();

            sendEmailRecovery({ user, recovery: recoveryData }, (error, success) => {
                if (error) {
                    return res.status(500).json({ success: false, message: "Erro ao enviar e-mail de recuperação de senha." });
                }

                return res.render("recovery", { error, success });
            });
        } catch (error) {
            next(error);
        }
    }

    async GetCompleteRecovery(req, res, next) {
        const token = req.query.token;
        try {
            if (!token) return res.render("recovery", { message: "Token não identificado", success: null });

            const user = await Users.findOne({ "recovery.token": token });
            if (!user) return res.render("recovery", { message: "Não existe usuário com este token", success: null });

            if (new Date(user.recovery.date) < new Date()) return res.render("recovery", { message: "Token expirado", success: null });

            return res.render("recovery/store", { message: null, success: null, token: token });
        } catch (error) {
            next(error);
        }
    }

    async completeRecovery(req, res, next) {
        const { token, password } = req.body;
        try {
            if (!token || !password) {
                return res.render("recovery/store", { message: "Preencha novamente com a sua senha", success: false, token: token });
            }

            const user = await Users.findOne({ "recovery.token": token });
            if (!user) {
                return res.render("recovery", { message: "Usuário não identificado", success: false });
            }

            user.finalTokenRecoveryPass();
            user.setPass(password);
            user.save();

            return res.render("recovery/store", { message: null, success: true, token: null });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new UserController();
