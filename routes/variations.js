const router = require("express").Router();
const VariationController = require("../controllers/VariationController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const variationValidation = require("../controllers/validations/variationValidation");
const upload = require("../config/multer");



router.get("/variations", auth.require, variationValidation.getAllVariations, VariationController.getAllVariations);

router.get("/variation/:id", variationValidation.getVariatiosProduct, VariationController.getVariation);

router.post("/variation/:product", auth.require, AdminValidator, upload.array("files"), variationValidation.createVariation, VariationController.createVariation);

router.put("/variation/:id", auth.require, AdminValidator, upload.array("files"), variationValidation.updateVariation, VariationController.updateVariation);

router.delete("/variation/:id", auth.require, AdminValidator, variationValidation.deleteVariation, VariationController.deleteVariation);

module.exports = router;
