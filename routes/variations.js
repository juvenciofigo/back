const router = require("express").Router();
const VariationController = require("../controllers/VariationController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const variationValidation = require("../controllers/validations/variationValidation");
const upload = require("../config/multer");

router.get("/variations", variationValidation.getAllVariations, VariationController.getAllVariations); // testado
router.get("/variations/:id", variationValidation.getVariatiosProduct, VariationController.getVariatiosProduct); // testado

router.post("/variation/:product", auth.require, AdminValidator, variationValidation.createVariation, VariationController.createVariation); // testado
router.put("/variation/:id", auth.require, AdminValidator, variationValidation.updateVariation, VariationController.updateVariation); // testado
router.put("/variation/:id/image", auth.require, variationValidation.imageVariation, AdminValidator, upload.array("files", 5), VariationController.imageVariation); // testado

router.delete("/variation/:id", auth.require, AdminValidator, variationValidation.deleteVariation, VariationController.deleteVariation);

module.exports = router;
