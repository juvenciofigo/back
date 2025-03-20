const Users = require("../../models/Users");

module.exports = async (req, res, next) => {
    const id = req.auth._id;

    // Verifica se o ID é válido (24 caracteres hexadecimais)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ success: false, message: "ID inválido." });
    }

    try {
        // Busca apenas o campo 'role' do usuário
        const user = await Users.findOne({ _id: id }).select("role");

        // Verifica se o usuário existe e se é um administrador
        if (!user || !user.role.includes("admin")) {
            return res.status(403).json({ success: false, message: "Não tem permissão." });
        }

        // Se o usuário for um administrador, prossegue para o próximo middleware
        next();
    } catch (error) {
        console.error("Erro no middleware de verificação de admin:", error); // Log detalhado do erro
        next(error);
    }
};
