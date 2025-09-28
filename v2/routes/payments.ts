import { Router } from "express";
const router = Router();

import auth from "./auth.js";
import PaymentController from "../controllers/PaymentController.js";

// client
router.post("/mpesaPay", auth.require, PaymentController.PayOrder);

export default router;
