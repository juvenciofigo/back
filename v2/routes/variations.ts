import { Router } from "express";
const router = Router();

import VariationController from "../controllers/VariationController.js";
import auth from "./auth.js";
import AdminValidator from "../controllers/validations/adminValidator.js";
import variationValidation from "../controllers/validations/variationValidation.js";
import upload from "../config/multer.js";

router.get("/variations", auth.require, variationValidation.getAllVariations, VariationController.getAllVariations);

router.get("/variation/:id", variationValidation.getVariatiosProduct, VariationController.getVariation);

router.post("/variation/:product", auth.require, AdminValidator, upload.array("files"), variationValidation.createVariation, VariationController.createVariation);

router.put("/variation/:id", auth.require, AdminValidator, upload.array("files"), variationValidation.updateVariation, VariationController.updateVariation);

router.delete("/variation/:id", auth.require, AdminValidator, variationValidation.deleteVariation, VariationController.deleteVariation);

export default router;
