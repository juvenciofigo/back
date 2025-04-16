require("dotenv").config();
require("./database/connection");
const multer = require("multer");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const winston = require("winston");

const app = express();

// Configuração de logs com Winston
const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(), // Log para o console
        new winston.transports.File({ filename: "app.log" }), // Log em arquivo
    ],
});

// Configuração de Limite de Taxa (Rate Limiting)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 50, // Máximo de 50 requisições por IP
    message: "Muitas requisições. Tente novamente mais tarde.",
    keyGenerator: (req) => {
        const ip = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0] : req.connection.remoteAddress;
        logger.info(`IP do cliente: ${ip}`);
        return ip;
    },
    handler: (req, res) => {
        const retryAfter = 15 * 60; // Bloqueio por 15 minutos
        res.setHeader("Retry-After", retryAfter); // Header indicando o tempo de bloqueio
        res.status(429).json({
            success: false,
            message: `Muitas requisições feitas a partir deste IP. Tente novamente em ${retryAfter / 60} minutos.`,
        });
    },
});

// Configuração de ambiente
const isProduction = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT, 10) || 3000;

// Middleware para arquivos estáticos com cache controlado
app.use(
    "/public/images",
    express.static(path.join(__dirname, "public/images"), {
        maxAge: "30d", // Cache de 30 dias para imagens
    })
);

// Configuração de EJS para templates
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configuração de middleware condicional
if (isProduction) {
    app.use(morgan("common"));
} else {
    app.use(morgan("dev"));
}

app.use(cors());
app.disable("x-powered-by");
app.use(compression()); // Compressão para melhorar a performance

// Parse body requests com limites para segurança
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate limiter
app.use(limiter);

// Middleware para capturar o IP do cliente
app.use((req, res, next) => {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    logger.info(`IP do Cliente: ${clientIp}`);
    next();
});

// Roteamento modularizado (exemplo com os módulos de rotas)
const usersRouter = require("./routes/users");
const customersRouter = require("./routes/customers");
const cartRouter = require("./routes/cart");
const productsRouter = require("./routes/products");
const categoryRouter = require("./routes/categorys");
const ratingsRouter = require("./routes/ratings");
const variationsRouter = require("./routes/variations");
const ordersRouter = require("./routes/orders");
const deliveriesRouter = require("./routes/deliveries");
const payments = require("./routes/payments");
const statistics = require("./routes/statistics");

// Roteamento para diferentes endpoints
app.use("/", usersRouter);
app.use("/", customersRouter);
app.use("/", cartRouter);
app.use("/", productsRouter);
app.use("/", categoryRouter);
app.use("/", ratingsRouter);
app.use("/", variationsRouter);
app.use("/", ordersRouter);
app.use("/", deliveriesRouter);
app.use("/", payments);
app.use("/", statistics);

// Rota inicial simples
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Middleware global de tratamento de erros
app.use((error, _, res) => {
    // Log no console
    console.log("app", error);

    // Logs diferenciados para ambiente de desenvolvimento ou produção
    if (process.env.NODE_ENV !== "production") {
        console.error(error); // Log completo no desenvolvimento
    } else {
        logger.error(error.message); // Log simplificado no ambiente de produção (com Winston)
    }

    // 1. Erros de validação do Mongoose
    if (error.errors) {
        const errors = Object.values(error.errors).map((err) => err.properties.message);
        return res.status(400).json({ message: errors.join(", ") });
    }

    // 2. Erros do Multer (upload de arquivos)
    if (error instanceof multer.MulterError) {
        logger.error("Erro no Multer:", error.message);
        return res.status(400).json({ message: error.message });
    }

    // 3. Erros de autenticação
    if (error.code === "credentials_required") {
        return res.status(401).json({ message: "Sem autorização" });
    }

    // 4. Erro genérico interno
    return res.status(500).json({ message: "Erro interno do servidor" });
});

// Handler para página não encontrada
app.use((_, res) => {
    const err = new Error("Not found");
    err.status = 404;
    return res.status(404).json({
        success: false,
        message: { message: err.message, status: 404 },
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    if (isProduction) {
        console.log(`Servidor rodando na porta ${PORT} em produção`);
    } else {
        console.log(process.env.NODE_ENV);
        console.log(`Servidor rodando em modo DEV na URL //localhost:${PORT}`);
    }
});
