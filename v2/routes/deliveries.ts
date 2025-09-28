import { Router } from "express";
const router = Router();

import DeliveryController from "../controllers/DeliveryController.js";
import auth from "./auth.js";
import AdminValidator from "../controllers/validations/adminValidator.js";

router.get("/delivery/:id", auth.require, DeliveryController.deliveryShow);
router.put("/delivery/:id", auth.require,AdminValidator, DeliveryController.update);
router.post("/delivery/:id", auth.require, DeliveryController.calcucate);

export default router;
