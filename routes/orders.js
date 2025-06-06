const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const orderValidation = require("../controllers/validations/orderValidation");

// Rotas para Admin

router.get("/orders/admin", auth.require, AdminValidator, orderValidation.getAllOrdersAdmin, OrderController.getAllOrdersAdmin); // Todos da loja

router.patch("/order", auth.require, AdminValidator, OrderController.updateOrders); // Meu

router.get("/order/admin/:id", auth.require, AdminValidator, orderValidation.getOrderAdmin, OrderController.getOrderAdmin); // Um pedido

router.delete("/order/admin/:id", auth.require, AdminValidator, orderValidation.deleteOrderAdmin, OrderController.deleteOrderAdmin); // Cancelar Pedido

router.get("/orders/admin/:id/cart", auth.require, AdminValidator, orderValidation.getOrderCartAdmin, OrderController.getOrderCartAdmin); // Detalhes de um carrinho do pedido

// Rotas para Cliente

router.get("/orders/:user", auth.require, orderValidation.getAllOrders, OrderController.getAllOrders); // Todos meus pedidos feitos

router.get("/orders/:id", auth.require, orderValidation.getOrder, OrderController.getOrder); // Um pedido Meu

router.post("/order", auth.require, orderValidation.createOrder, OrderController.createOrder); // Criando pedido

router.patch("/order/:id", auth.require, orderValidation.deleteOrder, OrderController.deleteOrder); // Meu

router.get("/orders/:id/cart", auth.require, orderValidation.getOrderCart, OrderController.getOrderCart); // Dados do carrinho do meu pedido

module.exports = router;
