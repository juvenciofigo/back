var Users = require("../../models/Users");

module.exports = async (req, res, next) => {
    const id = req.auth._id;

    try {
        if (id.length !== 24) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const user = await Users.findOne({ _id: id });
        
        if (!user || !user.role.includes("admin")) {
            return res.status(403).json({ success: false, message: "Não tem permissão" });
        }

        next();
    } catch (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
};
