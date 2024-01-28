var router = require("express").Router();
var StoreController = require("../controllers/StoreController");
const auth = require("./auth");

router.get("/stores", StoreController.stores); // tested
router.get("/store/:id", StoreController.showStore); // tested

router.post("/store", auth.require, StoreController.createStore); // tested
router.put("/store/:id", auth.require, StoreController.updateStore);
router.delete("/store/:id", auth.require, StoreController.deleteStore);

module.exports = router;
