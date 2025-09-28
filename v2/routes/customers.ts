import { Router } from "express";
const router = Router();

import CustomerController from "../controllers/CustomerController.js";
import auth from "./auth.js";
import AdminValidator from "../controllers/validations/adminValidator.js";
import CustomerValidation from "../controllers/validations/customerValidation.js";
import CustomerValidator from "../controllers/validations/customerValidator.js";

// Admin

router.get("/customers/admin", auth.require, AdminValidator, CustomerValidation.getAllCustomers, CustomerController.getAllCustomers);

router.get("/customers/search/:search/orders", auth.require, AdminValidator, CustomerValidation.searchOrders, CustomerController.searchOrders); // Procurar Entre Os Pedidos

router.get("/customers/search/:search", auth.require, AdminValidator, CustomerValidation.search, CustomerController.search);

router.get("/customer/admin/:id", auth.require, AdminValidator, CustomerValidation.showCustomerAdmin, CustomerController.showCustomerAdmin);

router.get("/customers/admin/:id/orders", auth.require, AdminValidator, CustomerValidation.showOrdersCustomers, CustomerController.showOrdersCustomers); // Pedidos De Um Cliente

router.delete("/customer/admin/:id", auth.require, AdminValidator, CustomerController.deleteAdmin);

router.put("/customer/admin/:id", auth.require, AdminValidator, CustomerValidation.updateCustomerAdmin, CustomerController.updateAdmin);

// Customer

router.get("/customer/:id", auth.require, CustomerValidator, CustomerValidation.mySelf, CustomerValidation.removeMySelf, CustomerController.mySelf);

router.post("/customer/:id", auth.require, CustomerValidation.createCustomer, CustomerController.createCustomer);

router.get("/customer/:id/addresses", auth.require, CustomerValidator, CustomerController.allAddress);

router.post("/customer/:id/address/", auth.require, CustomerValidation.addAddress, CustomerValidator, CustomerController.addAddress);

router.delete("/customer/:addressId/address/", auth.require, CustomerValidator, CustomerController.deleteAddress);

router.put("/customer/:id", auth.require, CustomerValidator, CustomerValidation.updateCustomer, CustomerController.updateMySelf);

router.delete("/customer/:id", auth.require, CustomerValidator, CustomerValidation.mySelf, CustomerController.removeMySelf);

export default router;
