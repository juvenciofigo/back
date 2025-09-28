import { Router } from "express";
const router = Router();

import auth from "./auth.js";
import AdminValidator from "../controllers/validations/adminValidator.js";
import statisticsValidator from "../controllers/validations/statisticsValidator.js";

import statisticsController from "../controllers/StatisticsController.js";

///
router.get("/estatistic", auth.require, AdminValidator, statisticsController.superficial);

router.get("/ordersByCustumer/:user", statisticsValidator.ordersByCustumer, statisticsController.ordersByCustumer);
router.get("/DataByMonth/", statisticsController.DataByMonth);
router.get("/recentOrders/", statisticsController.recentOrders);

export default router;
