require("../models/Stores");
const mongoose = require("../database/connection");
var Stores = mongoose.model("Store");

class StoreController {
    async stores(req, res, next) {
        try {
            var stores = await Stores.find({}).select("_id storeName cnpj contacts address");
            res.status(200).json(stores);
        } catch (error) {
            next(error);
        }
    }

    async showStore(req, res, next) {
        try {
            var store = await Stores.findById(req.params.id);
            res.status(200).json(store);
        } catch (error) {
            next(error);
        }
    }

    async createStore(req, res, next) {
        const { storeName, cnpj, contacts, address, email } = req.body;
        try {
            //validate
            var error = [];
            if (!storeName) error.push("storeName");
            if (!cnpj) error.push("cnpj");
            if (!contacts) error.push("contacts");
            if (!address) error.push("address");
            if (!email) error.push("email");
            if (error.length > 0) return res.status(422).json({ error: "required", payload: error });

            //create store
            var store = new Stores({ storeName, cnpj, contacts, address, email });
            await store.save();

            // send res
            return res.status(200).json(store);
        } catch (error) {
            next(error);
        }
    }

    async updateStore(req, res, next) {
        const { storeName, cnpj, contacts, address, email } = req.body;
        try {
            var store = await Stores.findById(req.params.id);
            if (!store) return res.status(422).send({ error: "Loja não existe." });

            if (storeName) store.storeName = storeName;
            if (cnpj) store.cnpj = cnpj;
            if (email) store.email = email;
            if (contacts) store.contacts = contacts;
            if (address) store.address = address;

            await store.save();
            res.status(200).json({ store });
        } catch (error) {
            next(error);
        }
    }

    async deleteStore(req, res, next) {
        try {
            var store = await Stores.findById(req.params.id);
            if (!store) return res.status(422).send({ error: "Loja não existe." });

            await store.deleteOne();
            res.status(200).json({ delete: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StoreController();
