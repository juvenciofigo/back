var router = require("express").Router();
var CustomerController = require("../controllers/CustomerController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const CustomerValidation = require("../controllers/validations/customerValidation");
const CustomerValidator = require("../controllers/validations/customerValidator");

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

router.post("/customer/:userId", auth.require, CustomerValidation.createCustomer, CustomerController.createCustomer);

router.get("/customer/:userId/addresses", auth.require, CustomerController.allAddress);
router.post("/customer/:userId/address/", auth.require, CustomerController.addAddress);
router.put("/customer/:addressId/address/", auth.require, CustomerController.deleteAddress);

router.put("/customer/:id", auth.require, CustomerValidator, CustomerValidation.updateCustomer, CustomerController.updateMySelf);

router.delete("/customer/:id", auth.require, CustomerValidator, CustomerValidation.mySelf, CustomerController.removeMySelf);

module.exports = router;
