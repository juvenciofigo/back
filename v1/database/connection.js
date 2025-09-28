const mongoose = require("mongoose");
const dbs = require("../config/database");

const isProduction = process.env.NODE_ENV === "production";
const dbURI = isProduction ? dbs.dbproduction : dbs.dbTest;

mongoose
    .connect(dbURI, {
        serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
        console.log("✅ Conectado ao MongoDB:", isProduction ? "Produção" : "Teste");
    })
    .catch((err) => {
        console.error(`"\n ❌ Erro na conexão com o MongoDB:", ${err.message} \n \n `);
    });

// Evento para capturar erros de conexão após a conexão inicial
mongoose.connection.on("error", (err) => {
    console.error({ message: "❌ Erro no banco de dados:", err });
});

module.exports = mongoose;
