import "dotenv/config";

import express, { Express, Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import winston from "winston";

import "../database/connection.js";

// Rotas
import UserNew from "./modules/user/routes.js";
import CartNew from "./modules/cart/routes.js";
import CategoryNew from "./modules/category/routes.js";
import { BaseError } from "./shared/BaseError.js";

// Old //
// import usersRouter from "../routes/users.js";
// import customersRouter from "../routes/customers.js";
// import cartRouter from "../routes/carts.js";
// import productsRouter from "../routes/products.js";
// import categoryRouter from "../routes/categorys.js";
// import ratingsRouter from "../routes/ratings.js";
// import variationsRouter from "../routes/variations.js";
// import ordersRouter from "../routes/orders.js";
// import deliveriesRouter from "../routes/deliveries.js";
// import paymentsRouter from "../routes/payments.js";
// import statisticsRouter from "../routes/statistics.js";
// import { BaseError } from "./shared/BaseError.js";

// Config __dirname para ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

const app: Express = express();
const isProduction = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || "3000", 10);

// Logger com Winston
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: "app.log" })],
});

// Rate Limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 50,
    message: "Muitas requisições. Tente novamente mais tarde.",
    keyGenerator: (req: Request): string => {
        const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0] ?? req.socket.remoteAddress ?? "unknown";

        // logger.info(`IP do cliente: ${ip}`);
        return ip;
    },
    handler: (req: Request, res: Response) => {
        const retryAfter = 15 * 60; // 15 minutos
        res.setHeader("Retry-After", retryAfter);
        res.status(429).json({
            success: false,
            message: `Muitas requisições feitas a partir deste IP. Tente novamente em ${retryAfter / 60} minutos.`,
        });
    },
});

// Middlewares
app.use("/public/images", express.static(join(__dirname, "public/images"), { maxAge: "30d" }));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(isProduction ? morgan("common") : morgan("dev"));
app.use(cors());
app.disable("x-powered-by");
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(limiter);

// Log de IP
app.use((req: Request, _res: Response, next: NextFunction) => {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    logger.info(`IP do Cliente: ${clientIp}`);
    next();
});

// Rotas
app.use("/", UserNew);
app.use("/", CartNew);
app.use("/", CategoryNew);

// Old
// app.use("/", usersRouter);
// app.use("/", customersRouter);
// app.use("/", cartRouter);
// app.use("/", productsRouter);
// app.use("/", categoryRouter);
// app.use("/", ratingsRouter);
// app.use("/", variationsRouter);
// app.use("/", ordersRouter);
// app.use("/", deliveriesRouter);
// app.use("/", paymentsRouter);
// app.use("/", statisticsRouter);

// Rota inicial simples
app.get("/", (_req: Request, res: Response) => {
    res.send("Hello World!");
});

// Middleware global de erro
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error((error.message && error.stack) || "Erro interno do servidor");

    if (error instanceof BaseError) {
        return res.status(error.statusCode).json({ message: error.message  + "🤦‍♂️" });
    }

    if (error.name === "UnauthorizedError") {
        return res.status(401).json({ error: error.message });
    }
    // Caso seja erro de validação do Mongoose
    if (error instanceof MongooseError.ValidatorError) {
        const errors = Object.values(error).map((err) => err?.properties?.message || "Erro de validação");
        return res.status(400).json({ message: errors.join(", ") });
    }

    // Caso seja erro do Multer
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: error.message });
    }

    // Caso seja erro de autenticação (exemplo do express-jwt)
    if (typeof error === "object" && error !== null && "code" in error && error.code === "credentials_required") {
        return res.status(401).json({ message: "Sem autorização" });
    }

    // Erro genérico
    return res.status(500).json({ message: "Erro interno do servidor" });
});

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: { message: "Not found", status: 404 },
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(isProduction ? `Servidor rodando na porta ${PORT} em produção` : `Servidor rodando em modo DEV na URL http://localhost:${PORT}`);
});
