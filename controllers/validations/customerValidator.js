var Custumers = require("../../models/Customers");

module.exports = async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    try {
        if (id.length !== 24) {
            return res.status(400).json({ error: "ID inválido. O comprimento deve ser 24 caracteres." });
        }
        const customer = await Custumers.findById(id);

        if (customer.id !== id) {
            return res.status(403).json({ success: false, error: "Não tem permissão" });
        }
        return next();
    } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        return res.status(500).json({ success: false, error: "Erro do servidor ao verificar permissões " });
    }
};
