require("../../models/Users");
require("../../models/Stores");
const mongoose = require("mongoose");
const Users = mongoose.model("User");
const Stores = mongoose.model("Store");

module.exports = async (req, res, next) => {
    try {
        console.log(req.params);
        if (!req.params.id) return res.sendStatus(401);

        const { store } = req.query;
        if (!store) return res.sendStatus(401);

        const user = await Users.findById(req.params.id);
        if (!user) return res.sendStatus(401);
        if (!user.store) return res.sendStatus(401);
        if (!user.store !== loja) return res.sendStatus(401);
        if (!user.role.incledes("admin")) return res.sendStatus(401);
        next();
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: "Ocorreu um erro interno." });
    }
};
