var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const ejs = require("ejs");
const compression = require("compression");

// requires routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cartRouter = require("./routes/cart");
var productsRouter = require("./routes/products");

const morgan = require("morgan");
const bodyParser = require("body-parser");

var app = express();

// ambient
const isProduction = process.env.NODE_env === "production";

app.use(logger("dev"));

app.use(bodyParser.json({ limit: 1.5 * 1024 * 1024 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

if (!isProduction) app.use(morgan("dev"));
app.use(cors());
app.disable("x-powered-by");

// use routes
app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/", cartRouter);
app.use("/", productsRouter);

app.use((req, res, next) => {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (err.status !== 404) {
        console.warn("Error", err.message, new Date());
        res.json({ errors: { message: err.message, status: res.statusCode } });
    }
});

module.exports = app;
