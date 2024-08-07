const router = require("express").Router();
const VariationController = require("../controllers/VariationController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const variationValidation = require("../controllers/validations/variationValidation");
const upload = require("../config/multer");
const uploadMultiple = require("../config/clodinary");

router.get("/variations", auth.require, variationValidation.getAllVariations, VariationController.getAllVariations); // testado

router.get("/variation/:id", variationValidation.getVariatiosProduct, VariationController.getVariation); // testado

router.post("/variation/:product", auth.require, AdminValidator, upload.array("files"), variationValidation.createVariation, uploadMultiple, VariationController.createVariation); // testado

router.put("/variation/:id", auth.require, AdminValidator, upload.array("files"), variationValidation.updateVariation, uploadMultiple, VariationController.updateVariation); // testado

// router.put("/variation/:id/image", auth.require, variationValidation.imageVariation, AdminValidator, upload.array("files", 5), VariationController.imageVariation); // testado

router.delete("/variation/:id", auth.require, AdminValidator, variationValidation.deleteVariation, VariationController.deleteVariation);

module.exports = router;
