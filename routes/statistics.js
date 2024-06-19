const router = require("express").Router();
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const statisticsValidator = require("../controllers/validations/statisticsValidator");

const statisticsController = require("../controllers/StatisticsController");

///
router.get("/estatistic", auth.require, AdminValidator, statisticsController.superficial);

router.get("/ordersByCustumer/:user", statisticsValidator.ordersByCustumer, statisticsController.ordersByCustumer);
router.get("/DataByMonth/", statisticsController.DataByMonth);
router.get("/recentOrders/", statisticsController.recentOrders);

module.exports = router;
