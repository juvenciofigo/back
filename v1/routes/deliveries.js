const router = require("express").Router();
const DeliveryController = require("../controllers/DeliveryController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");

router.get("/delivery/:id", auth.require, DeliveryController.deliveryShow);
router.put("/delivery/:id", auth.require,AdminValidator, DeliveryController.update);
router.post("/delivery/:id", auth.require, DeliveryController.calcucate);

module.exports = router;
