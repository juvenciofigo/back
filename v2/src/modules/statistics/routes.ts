import { Router } from "express";

// Validadores globais de segurança assumindo partilha na arquitetura
import { IsAuthValidator } from "../../shared/validators/is-auth-validator.js";
import { IsAdminValidator } from "../../shared/validators/is-admin-validator.js";

import {
    getSuperficialStatsController,
    getOrdersByCustomerController,
    getDataByMonthController,
    getRecentOrdersController,
    getRevenueByMonthController,
    getTopSellingProductsController,
    getOrdersByCustomerValidator,
    fetchOrdersController,
    fetchOrdersValidator,
} from "./index.js";

const routes = Router();

// Todas as rotas de estatísticas são protegidas e requerem privilégios de Administrador
routes.use(IsAuthValidator.require);
routes.use(IsAdminValidator);

// 1. Rotas Migradas da v1
routes.get("/superficial", getSuperficialStatsController);
routes.get("/orders-by-customer/:userId", getOrdersByCustomerValidator, getOrdersByCustomerController);
routes.get("/data-by-month", getDataByMonthController);
routes.get("/recent-orders", getRecentOrdersController);

// 2. Novas Rotas (Melhorias)
routes.get("/revenue-by-month", getRevenueByMonthController);
routes.get("/top-selling-products", getTopSellingProductsController);

// 3. Listagem Avançada (Refatorada)
routes.get("/fetch-orders", fetchOrdersValidator, fetchOrdersController);

export default routes;
