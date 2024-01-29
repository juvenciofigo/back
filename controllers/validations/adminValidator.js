var Users = require("../../models/Users");

module.exports = async (req, res, next) => {
    const id = req.auth._id;
    try {
        if (id.length !== 24) {
            return res.status(400).json({ error: "ID inválido. O comprimento deve ser 24 caracteres." });
        }
        const user = await Users.findOne({ _id: id });
        if (!user || !user.role.includes("admin")) {
            return res.status(403).json({ success: false, error: "Não tem permissão" });
        } else {
            return next();
        }
    } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
