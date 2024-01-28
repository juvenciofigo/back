const router = require("express").Router();
const OrderController = require("../controllers/OrderController");

const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const orderValidation = require("../controllers/validations/orderValidation");

// // ADMIN

router.get("/orders/admin", auth.require, AdminValidator, orderValidation.getAllOrdersAdmin, OrderController.getAllOrdersAdmin); // Todos Da loja

// //
router.get("/orders/admin/:id", auth.require, AdminValidator, orderValidation.getOrderAdmin, OrderController.getOrderAdmin); // Um Pedido
router.delete("/order/admin/:id", auth.require, AdminValidator, orderValidation.deleteOrderAdmin, OrderController.deleteOrderAdmin); // Cancelar Pedido
router.get("/orders/:id/cart", auth.require, AdminValidator, orderValidation.getOrderCartAdmin, OrderController.getOrderCartAdmin); // Detalhes De Um Carrinho Do Pedido

// // ----Entrega

// // ----Pagamento

// // CLIENTE

router.get("/orders/", auth.require, orderValidation.getAllOrders, OrderController.getAllOrders); // Todos Pedidos Feitos
router.get("/orders/:id", auth.require, orderValidation.getOrder, OrderController.getOrder); // Um pedido
router.post("/order", auth.require, orderValidation.createOrder, OrderController.createOrder); // Criando Pedido
router.delete("/order/:id", auth.require, orderValidation.deleteOrder, OrderController.deleteOrder); // Do Cliente

router.get("/orders/:id/cart", auth.require, orderValidation.getOrderCart, OrderController.getOrderCart); // Dados do Carrinho Do Pedido

// // ----Entrega

// // ----Pagamento

module.exports = router;
