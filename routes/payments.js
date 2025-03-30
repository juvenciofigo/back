const router = require("express").Router();
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const PaymentController = require("../controllers/PaymentController");


// client
router.post("/mpesaPay", auth.require,  PaymentController.PayOrder);

module.exports = router;
