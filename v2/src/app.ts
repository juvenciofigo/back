import "dotenv/config";

import express, { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";

// Logger com Winston
import logger from "../logs/logger.js";

// Conexão do DB movida para server.ts
// import "../database/connection.js";
// Rotas
import User from "./modules/user/routes.js";
import Cart from "./modules/cart/routes.js";
import Category from "./modules/category/routes.js";
import Product from "./modules/product/routes.js";
import Statistics from "./modules/statistics/routes.js";
import { BaseError } from "./shared/BaseError.js";
import status from "http-status";
import { MongoError } from "./shared/errors.js";

// Config __dirname para ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

const app: Express = express();
const isProduction = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || "3000", 10);

// Rate Limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 50,
    message: "Muitas requisições. Tente novamente mais tarde.",
    keyGenerator: (req: Request): string => {
        const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0] ?? req.socket.remoteAddress ?? "unknown";
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

app.use(
    isProduction
        ? morgan("common", {
              stream: {
                  write: (message) => logger.info(message.trim()),
              },
          })
        : morgan("dev")
);
app.use(cors());
app.disable("x-powered-by");
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(limiter);

// Rotas
app.use("/", User);
app.use("/carts", Cart);
app.use("/", Category);
app.use("/", Product);
app.use("/statistics", Statistics);

// Rota inicial simples
app.get("/", (_req: Request, res: Response) => {
    res.send("Hello World!");
});

// Middleware global de erro
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error((error.message && error.stack) || "Erro interno do servidor");

    if (error instanceof BaseError) {
        return res.status(error.statusCode).json({ message: error.message + "🤦‍♂️" });
    }

    if (error.name === "UnauthorizedError") {
        return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    // Caso seja erro de validação do Mongoose
    
    const mongoError = error as MongoError;
    
    if (mongoError.name === "MongoServerError") {
        if (mongoError.code === 11000 && mongoError.keyValue) {
            const field = Object.keys(mongoError.keyValue)[0] || 0;
            const value = mongoError.keyValue[field];
            return res.status(400).json({
                message: `O valor '${value}' para o campo '${field}' já existe.`
            });
        }
        return res.status(400).json({ message: mongoError.message || "Erro no MongoDB" });
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

// Inicialização movida para server.ts

export default app;
