import { Router } from "express";
const router = Router();

import {
    createOrderController,
    createOrderValidator,
    IsAuthValidator,
    IsAdminValidator,
} from "./index.js";

// Rotas para Admin

// router.get("/orders/admin", IsAuthValidator.require, IsAdminValidator, orderValidation.getAllOrdersAdmin, OrderController.getAllOrdersAdmin);

// router.patch("/order", IsAuthValidator.require, IsAdminValidator, OrderController.updateOrders); 

// router.get("/order/admin/:id", IsAuthValidator.require, IsAdminValidator, orderValidation.getOrderAdmin, OrderController.getOrderAdmin);

// router.delete("/order/admin/:id", IsAuthValidator.require, IsAdminValidator, orderValidation.deleteOrderAdmin, OrderController.deleteOrderAdmin); 

// router.get("/orders/admin/:id/cart", IsAuthValidator.require, IsAdminValidator, orderValidation.getOrderCartAdmin, OrderController.getOrderCartAdmin);

// Rotas para Cliente

// router.get("/orders/:user", IsAuthValidator.require, orderValidation.getAllOrders, OrderController.getAllOrders); 

// router.get("/orders/:id", IsAuthValidator.require, orderValidation.getOrder, OrderController.getOrder); 

router.post("/order", IsAuthValidator.require, createOrderValidator, createOrderController); 

// router.patch("/order/:id", IsAuthValidator.require, orderValidation.deleteOrder, OrderController.deleteOrder); 

// router.get("/orders/:id/cart", IsAuthValidator.require, orderValidation.getOrderCart, OrderController.getOrderCart); 

export default router;
