var Custumers = require("../../models/Customers");
const Users = require("../../models/Users");

module.exports = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (id.length !== 24) {
            return res.status(400).json({ message: "ID inválido. O comprimento deve ser 24 caracteres." });
        }
        const customer = await Custumers.findOne({ user: id });

        if (!customer) {
            const user = await Users.findById(id).select("-recovery -salt -password -role -cart -createdAt -deleted -updatedAt");

            return res.status(202).json({ user: user, message: "Cliente não encontrado." });
        }

        if (customer.user.toString() !== id.toString()) {
            return res.status(403).json({ success: false, message: "Não tem permissão" });
        }
        return next();
    } catch (error) {
        next(error);
    }
};
