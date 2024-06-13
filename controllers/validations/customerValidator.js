var Custumers = require("../../models/Customers");

module.exports = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (id.length !== 24) {
            return res.status(400).json({ message: "ID inválido. O comprimento deve ser 24 caracteres." });
        }
        const customer = await Custumers.findById(id);

        if (customer.id !== id) {
            return res.status(403).json({ success: false, message: "Não tem permissão" });
        }
        return next();
    } catch (error) {
        next(error);
    }
};
