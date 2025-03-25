require("dotenv").config();
const multer = require("multer");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const ejs = require("ejs");
const compression = require("compression");
const bodyParser = require("body-parser");

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 50, // Máximo de 50 requisições por IP
    message: "Muitas requisições. Tente novamente mais tarde.",
    keyGenerator: (req, res) => {
        // Obtém o IP real do cliente a partir do X-Forwarded-For
        const ip = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"].split(",")[0] : req.connection.remoteAddress;
        console.log("IP do real Cliente:", ip);
    },
    handler: (req, res) => {
        const retryAfter = 15 * 60; // Definir o tempo de bloqueio (em segundos), neste caso 15 minutos
        res.setHeader("Retry-After", retryAfter); // Header indicando ao cliente o tempo para tentar novamente
        res.status(429).json({
            success: false,
            message: `Muitas requisições feitas a partir deste IP. Tente novamente em ${retryAfter / 60} minutos.`,
        });
    },
});

// requires routes
const usersRouter = require("./routes/users");
const customersRouter = require("./routes/customers");
const cartRouter = require("./routes/cart");
const productsRouter = require("./routes/products");
const storeRouter = require("./routes/store");
const categoryRouter = require("./routes/categorys");
const ratingsRouter = require("./routes/ratings");
const variationsRouter = require("./routes/variations");
const ordersRouter = require("./routes/orders");
const deliveriesRouter = require("./routes/deliveries");
const payments = require("./routes/payments");
const statistics = require("./routes/statistics");
const { log } = require("console");

const app = express();
app.use(limiter);

// Ambient
const isProduction = process.env.NODE_ENV === "production";
var PORT = process.env.PORT || "3000";

// Middlewares
app.use("/public/images", express.static(path.join(__dirname, "public/images")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// config
if (!isProduction) app.use(morgan("dev"));
else app.use(morgan("common"));
app.use(cors());
app.disable("x-powered-by");
app.use(compression());

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(cookieParser());

// Routes

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((req, res, next) => {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("IP do Cliente:", clientIp);
    next();
});

app.use("/", usersRouter);
app.use("/", customersRouter);
app.use("/", cartRouter);
app.use("/", productsRouter);
app.use("/", storeRouter);
app.use("/", categoryRouter);
app.use("/", ratingsRouter);
app.use("/", variationsRouter);
app.use("/", ordersRouter);
app.use("/", deliveriesRouter);
app.use("/", payments);
app.use("/", statistics);

// Error Handling
app.use((error, req, res, next) => {
    console.log(error);
    
    if (error.errors) {
        const errors = Object.values(error.errors).map((error) => error.properties.message);
        console.log(errors);
        return res.status(400).json({ message: errors.toLocaleString() });
    } else if (error instanceof multer.MulterError) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    } else if (error.code === "credentials_required") {
        console.log(error);
        return res.status(400).json({ message: "Sem autorizacao" });
    } else {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
});

app.use((req, res, next) => {
    const err = new Error("Not found");
    err.status = 404;
    return res.status(404).json({ success: false, message: { message: err.message, status: 404 } });
});

app.listen(PORT, () => {
    if (isProduction) console.log(`Server port:${PORT} in prod`);
    else {
        console.log(process.env.NODE_ENV);
        console.log(`Server is running in DEV mode at //localhost:${PORT} in dev`);
    }
});
