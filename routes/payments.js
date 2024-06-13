const router = require("express").Router();
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const PaymentController = require("../controllers/PaymentController");
const paymentValidation = require("../controllers/validations/paymentValidation");

// client
router.post("/mpesaPay", auth.require, paymentValidation.C2B, PaymentController.mpesaPay);

module.exports = router;
