const { options } = require("joi"),
    Products = require("../models/Products"),
    Orders = require("../models/Orders"),
    Variations = require("../models/Variations"),
    Payments = require("../models/Payments"),
    Deliveries = require("../models/Deliveries"),
    Customers = require("../models/Customers"),
    Users = require("../models/Users"),//
    CartValidation = require("./validations/cartValidation");

class OrderController {
    async getAllOrdersAdmin(req, res, next) {
        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 30,
            populate: ["customerOrder paymentOrder deliveryOrder"],
        };

        try {
            const orders = await Orders.paginate({}, options);

            if (!orders.docs || orders.docs.length === 0) {
                return res.status(400).json({ success: false, error: "Nenhum pedido encontrado" });
            }

            await Promise.all(
                orders.docs.map(async (order) => {
                    order.Ordercart = await Promise.all(
                        order.Ordercart.map(async (item) => {
                            item.productOrder = await Products.findById(item.productOrder);
                            item.variationOrder = await Variations.findById(item.variationOrder);
                            return item;
                        })
                    );
                })
            );

            return res.status(200).json({ success: true, orders });
        } catch (error) {
            next();
        }
    }

    async getOrderAdmin(req, res, next) {
        try {
            const order = await Orders.findOne({ _id: req.params.id }).populate("customerOrder paymentOrder deliveryOrder").exec();

            if (!order) {
                return res.status(400).json({ success: false, error: "Pedido não encontrado" });
            }

            order.Ordercart = await Promise.all(
                order.Ordercart.map(async (item) => {
                    item.productOrder = await Products.findById(item.productOrder);
                    item.variationOrder = await Variations.findById(item.variationOrder);
                    return item;
                })
            );

            return res.status(200).json({ success: true, order });
        } catch (error) {
            next();
        }
    }

    async deleteOrderAdmin(req, res) {
        try {
            const order = await Orders.findOne({ _id: req.params.id }).populate(["customerOrder paymentOrder deliveryOrder"]);

            if (!order) {
                return res.status(400).json({ success: false, error: "Pedido não encontrado" });
            }
            order.orderCancel = true;

            //Registro de atividade = pedido cancelado
            // Enviar email para clinte!

            await order.save();

            return res.status(200).json({ success: true, order });
        } catch (error) {
            next();
        }
    }

    async getOrderCartAdmin(req, res, next) {
        try {
            const order = await Orders.findById(req.params.id);

            if (!order) {
                return res.status(404).json({ success: false, error: "Pedido não encontrado" });
            }

            order.Ordercart = await Promise.all(
                order.Ordercart.map(async (item) => {
                    item.productOrder = await Products.findById(item.productOrder);
                    item.variationOrder = await Variations.findById(item.variationOrder);
                    return item;
                })
            );

            return res.status(200).json({ success: true, order });
        } catch (error) {
            next();
        }
    }

    //CLIENTE

    async getAllOrders(req, res, next) {
        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 30,
            populate: ["customerOrder paymentOrder deliveryOrder"],
        };

        try {
            const customer = await Orders.findById({ user: req.payload.id });

            if (!customer) {
                return res.status(400).json({ success: false, error: "Cliente não encontrado" });
            }
            const orders = await Orders.paginate({ customerOrder: customer._id }, options);

            if (!orders) {
                return res.status(400).json({ success: false, error: "Nenhum pedido encontrado" });
            }

            orders.docs = await Promise.all(
                orders.docs.map(async (order) => {
                    order.Ordercart = await Promise.all(
                        order.Ordercart.map(async (item) => {
                            item.productOrder = await Products.findById(item.productOrder);
                            item.variationOrder = await Variations.findById(item.variationOrder);
                            return item;
                        })
                    );
                    return order;
                })
            );

            return res.status(200).json({ success: true, orders });
        } catch (error) {
            next();
        }
    }

    async getOrder(req, res, next) {
        try {
            const customer = await Orders.findById({ user: req.payload.id });

            if (!customer) {
                return res.status(400).json({ success: false, error: "Cliente não encontrado" });
            }

            const order = await Orders.findOne({ customerOrder: customer._id, _id: req.params.id }).populate("customerOrder paymentOrder deliveryOrder").exec();

            if (!order) {
                return res.status(400).json({ success: false, error: "Pedido não encontrado" });
            }

            order.Ordercart = await Promise.all(
                order.Ordercart.map(async (item) => {
                    item.productOrder = await Products.findById(item.productOrder);
                    item.variationOrder = await Variations.findById(item.variationOrder);
                    return item;
                })
            );

            return res.status(200).json({ success: true, order });
        } catch (error) {
            next();
        }
    }

    async createOrder(req, res, next) {
        const { cart, payment, delivery } = req.body;
        try {
            // // Check Data Cart
            // if (!CartValidation(cart)) {
            //     return res.status(400).json({ success: false, msg: "Dados do carrinho inválidos" });
            // }

            // // Check Data Delivery
            // if (!DeliveryValidation(cart)) {
            //     return res.status(400).json({ success: false, msg: "Dados da entrega inválidos" });
            // }

            // // Check Data Payment
            // if (!PaymentValidation(cart)) {
            //     return res.status(400).json({ success: false, msg: "Dados do pagamento inválidos" });
            // }

            const customer = await Customers.findOneAndDelete({ user: req.payload.id });

            const newPayment = new Payments({
                Amount: payment.Amount,
                PaymentForm: payment.PaymentForm,
                PaymentInstallments: payment.PaymentInstallments,
                PaymentStatus: "start",
                paymentOrder: payment.paymentOrder,
                payload: payment,
            });

            const newDelivery = new Deliveries({
                deliveryStatus: delivery.deliveryStatus,
                deliveryCodeTrack: delivery.deliveryCodeTrack,
                deliveryType: delivery.deliveryType,
                deliveryCost: delivery.deliveryCost,
                deliveryDeadline: delivery.deliveryDeadline,
                deliveryOrder: delivery.deliveryOrder,
                payload: delivery,
            });

            const order = new Orders({
                customer: customer._id,
                Ordercart: cart,
                paymentOrder: newPayment._id,
                deliveryOrder: newDelivery._id,
            });
            newPayment.paymentOrder = order._id;
            newDelivery.deliveryOrder = order._id;

            await order.save();
            await newPayment.save();
            await newDelivery.save();

            // Notificar via email - cliente e admin = New order

            return res.status(200).json({ order: Object.assign({}, order, { delivery: newDelivery, payment: newPayment, customer }) });
        } catch (error) {
            next();
        }
    }

    async deleteOrder(req, res) {
        try {
            const customer = await Orders.findById({ user: req.payload.id });

            if (!customer) {
                return res.status(400).json({ success: false, error: "Cliente não encontrado" });
            }
            const order = await Orders.findOne({ customerOrder: customer._id, _id: req.params.id }).populate(["customerOrder paymentOrder deliveryOrder"]);

            if (!order) {
                return res.status(400).json({ success: false, error: "Pedido não encontrado" });
            }
            order.orderCancel = true;

            //Registro de atividade = pedido cancelado
            // Enviar email para Admin!

            await order.save();

            return res.status(200).json({ success: true, order });
        } catch (error) {
            next();
        }
    }

    async getOrderCart(req, res, next) {
        try {
            const customer = await Orders.findById({ user: req.payload.id });

            if (!customer) {
                return res.status(400).json({ success: false, error: "Cliente não encontrado" });
            }

            const order = await Orders.findOne({ customerOrder: customer._id, _id: req.params.id });

            if (!order) {
                return res.status(404).json({ success: false, error: "Pedido não encontrado" });
            }

            order.Ordercart = await Promise.all(
                order.Ordercart.map(async (item) => {
                    item.productOrder = await Products.findById(item.productOrder);
                    item.variationOrder = await Variations.findById(item.variationOrder);
                    return item;
                })
            );

            return res.status(200).json({ success: true, order });
        } catch (error) {
            next();
        }
    }
}

module.exports = new OrderController();
