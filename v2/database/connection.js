import mongoose from "mongoose";
import dbs from "../config/database.js";

const isProduction = process.env.NODE_ENV === "production";

const dbURI = isProduction ? dbs.dbproduction : dbs.dbTest;

mongoose
    .connect(dbURI, { serverSelectionTimeoutMS: 30000 })
    .then(() => {
        console.log("✅ Conectado ao MongoDB:", isProduction ? "Produção" : "Teste");
    })
    .catch((err) => {
        console.error(`\n ❌ Erro na conexão com o MongoDB: ${err.message} \n`);
    });

mongoose.connection.on("error", (err) => {
    console.error({ message: "❌ Erro no banco de dados:", err });
});

export default mongoose;
