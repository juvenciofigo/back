const nodemailer = require("nodemailer");
const emailConfig = require("../config/email");
const { api: link } = require("../config/index");
// const transporter = nodemailer.createTransport(emailConfig);
var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "58058046b45a2b",
        pass: "a9c23cc907357c",
    },
});

module.exports = ({ user, recovery }, cb) => {
    const recoveryLink = `${link}/recoverPass?token=${recovery.token}`;

    const message = `
        <h1 style="text-align: center;">Recuperação de Senha</h1>
        <br />
        <p>
            Aqui está o link para redefinir a sua senha. Acesse e digite sua nova senha:
        </p>
        <a href="${recoveryLink}">${recoveryLink}</a>
        <br /><br /><hr />
        <p>
            Obs.: Se você não solicitou a redefinição, apenas ignore este e-mail.
        </p>
        <br />
        <p>Atenciosamente, ${process.env.STORE_NAME}</p>
    `;

    const emailOptions = {
        from: "naoresponder@Nomedaloja.com",
        to: user.email,
        subject: "Redefinição de Senha - Nome da loja",
        html: message,
    };

    if (process.env.NODE_ENV === "production") {
        transporter.sendMail(emailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return cb("Aconteceu um erro no envio do email, tente novamente.");
            } else {
                return cb(null, "Link para redefinição de senha foi enviado com sucesso para seu email.");
            }
        });
    } else {
        return cb(null, "Link para redefinição de senha foi enviado com sucesso para seu email.");
    }
};
