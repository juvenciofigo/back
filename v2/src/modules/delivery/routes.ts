import { Router } from "express";
import {
    IsAuthValidator,
    IsAdminValidator,
    createDeliveryController,
    createDeliveryValidator,
    fetchDeliveriesController,
    fetchDeliveriesValidator,
    fetchCustomerDeliveriesController,
    fetchCustomerDeliveriesValidator,
    getDeliveryController,
    getDeliveryValidator,
    updateDeliveryController,
    updateDeliveryValidator,
    deleteDeliveryController,
    deleteDeliveryValidator
} from "./index.js";

const routes = Router();

/**
 * @Routes_Entregas (Deliveries)
 */

// --- Rotas do Cliente ---

// Listar as minhas entregas
routes.get("/my-deliveries", IsAuthValidator.require, fetchCustomerDeliveriesValidator, fetchCustomerDeliveriesController);


// --- Rotas do Admin ---

// Listagem global (Admin)
routes.get("/", IsAuthValidator.require, IsAdminValidator, fetchDeliveriesValidator, fetchDeliveriesController);

// Detalhes de uma entrega
routes.get("/:deliveryId", IsAuthValidator.require, IsAdminValidator, getDeliveryValidator, getDeliveryController);

// Criação de nova entrega
routes.post("/", IsAuthValidator.require, IsAdminValidator, createDeliveryValidator, createDeliveryController);

// Atualização de dados da entrega (parcial)
routes.patch("/:deliveryId", IsAuthValidator.require, IsAdminValidator, updateDeliveryValidator, updateDeliveryController);

// Eliminação de registo de entrega
routes.delete("/:deliveryId", IsAuthValidator.require, IsAdminValidator, deleteDeliveryValidator, deleteDeliveryController);

export default routes;
