import app from "./app.js";
import "../database/connection.js";

const PORT = parseInt(process.env.PORT || "3000", 10);
const isProduction = process.env.NODE_ENV === "production";

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(isProduction ? `✅ Servidor rodando na porta ${PORT} em produção` : `✅ Servidor rodando em modo DEV na URL http://localhost:${PORT}`);
});
