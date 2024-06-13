const mongoose = require("mongoose");
const dbs = require("../config/database");

const isProduction = process.env.NODE_ENV === "production";
const dbURI = isProduction ? process.env.MONGO_URI : dbs.dbTest;

mongoose
    .connect(dbURI, {
        serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
        console.log("Conectado ao MongoDB");
    })
    .catch((err) => {
        console.error({ err, msg: "Erro na conexão" });
    });

module.exports = mongoose;
