const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const ejs = require("ejs");
const compression = require("compression");
const morgan = require("morgan");
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

const app = express();

// Ambient
const isProduction = process.env.NODE_env === "production";

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json({ limit: 1.5 * 1024 * 1024 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(compression());
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

if (!isProduction) {
    app.use(morgan("dev"));
}

// Routes
app.use("/", usersRouter);
app.use("/", customersRouter);
app.use("/", cartRouter);
app.use("/", productsRouter);
app.use("/", storeRouter);
app.use("/", categoryRouter);
app.use("/", ratingsRouter);
app.use("/", variationsRouter);
app.use("/", ordersRouter);

// Error Handling
app.use((req, res, next) => {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (err.status !== 404) {
        console.warn("Error", err.message, new Date());
        res.json({success: false, errors: { message: err.message, status: res.statusCode } });
    }
});

module.exports = app;
