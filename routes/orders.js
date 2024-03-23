const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const orderValidation = require("../controllers/validations/orderValidation");

// Rotas para Admin
//testado
router.get("/orders/admin", auth.require,  orderValidation.getAllOrdersAdmin, OrderController.getAllOrdersAdmin); // Todos da loja
//testado
router.get("/orders/admin/:id", auth.require, AdminValidator, orderValidation.getOrderAdmin, OrderController.getOrderAdmin); // Um pedido
//testado
router.delete("/order/admin/:id", auth.require, AdminValidator, orderValidation.deleteOrderAdmin, OrderController.deleteOrderAdmin); // Cancelar Pedido
//testado
router.get("/orders/admin/:id/cart", auth.require, AdminValidator, orderValidation.getOrderCartAdmin, OrderController.getOrderCartAdmin); // Detalhes de um carrinho do pedido

// Rotas para Cliente
//testado
router.get("/orders", auth.require, orderValidation.getAllOrders, OrderController.getAllOrders); // Todos meus pedidos feitos
//testado
router.get("/orders/:id", auth.require, orderValidation.getOrder, OrderController.getOrder); // Um pedido Meu
//testado
router.post("/order", auth.require, orderValidation.createOrder, OrderController.createOrder); // Criando pedido

// testado
router.delete("/order/:id", auth.require, orderValidation.deleteOrder, OrderController.deleteOrder); // Meu
//testado
router.get("/orders/:id/cart", auth.require, orderValidation.getOrderCart, OrderController.getOrderCart); // Dados do carrinho do meu pedido

// Rotas para Entrega e Pagamento (devem ser definidas)

// Exemplo (Substitua com suas implementações):
// router.get("/orders/:id/delivery", auth.require, orderValidation.getDelivery, OrderController.getDelivery);
// router.get("/orders/:id/payment", auth.require, orderValidation.getPayment, OrderController.getPayment);

module.exports = router;
