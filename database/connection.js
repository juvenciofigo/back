const mongoose = require("mongoose");
// const dbs = require("../config/database");
// const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest;


// mongoose
//     .connect(dbURI, {
//         serverSelectionTimeoutMS: 30000,
//     })
//     .then(() => {
//         console.log("Conectado ao MongoDB");
//     })
//     .catch((err) => {
//         console.error({ err, msg: "Erro na conexão" });
//     });

mongoose
    .connect("mongodb://127.0.0.1:27017/loja", {
        serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
        console.log("Conectado ao MongoDB");
    })
    .catch((err) => {
        console.error({ err, msg: "Erro na conexão" });
    });

module.exports = mongoose;
