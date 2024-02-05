require('dotenv').config();
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
        res.json({ success: false, errors: { message: err.message, status: res.statusCode } });
    }
});

app.listen(PORT, () => {
    if (isProduction) console.log(`Server is running at //localhost:${PORT}`);
    else console.log(`Server is running in DEV mode at //localhost:${PORT}`);
});
