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

const app = express();

// Ambient
const isProduction = process.env.NODE_ENV === "production";
var PORT = process.env.PORT || "3000";

// Middlewares
app.use("/public/images", express.static(path.join(__dirname, "public/images")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// config
if (!isProduction) app.use(morgan("dev"));
app.use(cors());
app.disable("x-powered-by");
app.use(compression());

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());

// Routes

app.get("/", (req, res) => {
    res.send("Hello World!");
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
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(400).json({ message: err.message });
    } else {
        console.error(err);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
});

app.use((req, res, next) => {
    const err = new Error("Not found");
    err.status = 404;
    return res.status(404).json({ success: false, message: { message: err.message, status: 404 } });
});

app.use((err, req, res, next) => {
    if (err.status !== 404) {
        console.warn("Error", err.message, new Date());
        return res.json({ success: false, message: { message: err.message, status: res.statusCode } });
    }
    return res.status(err.status || 500);
});

app.listen(PORT, () => {
    if (isProduction) console.log(`Server is running at //localhost:${PORT}`);
    else console.log(`Server is running in DEV mode at //localhost:${PORT}`);
});
