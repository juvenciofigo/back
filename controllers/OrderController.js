const Products = require("../models/Products"),
    Orders = require("../models/Orders"),
    Variations = require("../models/Variations"),
    Payments = require("../models/Payments"),
    Deliveries = require("../models/Deliveries"),
    Customers = require("../models/Customers"),
    OrderRegistrations = require("../models/OrderRegistrations"),
    Cart = require("../models/Carts"),
    Users = require("../models/Users"),
    CartValidation = require("./validations/cartValidation");

const getSort = (sortType) => {
    switch (sortType) {
        case "alphabet_a-z":
            return { productName: 1 };
        case "alphabet_z-a":
            return { productName: -1 };
        case "price-ascending":
            return { productPrice: 1 };
        case "price-descending":
            return { productPrice: -1 };
        default:
            return { updatedAt: -1 };
    }
};
class OrderController {
    async getAllOrdersAdmin(req, res, next) {
        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 10,
            populate: ["address ", "customer", "orderRegistration", "delivery", "payment"],
        };

        try {
            const orders = await Orders.paginate({}, options);

            if (!orders.docs || orders.docs.length === 0) {
                return res.status(200).json({ success: true, message: "Nenhum pedido encontrado" });
            }

            // await Promise.all(
            //     orders.docs.map(async (order) => {
            //         order.cart = await Promise.all(
            //             order.cart.map(async (item) => {
            //                 item.productOrder = await Products.findById(item.productOrder);
            //                 item.variationOrder = await Variations.findById(item.variationOrder);
            //                 return item;
            //             })
            //         );
            //     })
            // );
            return res.status(200).json({ success: true, orders });
        } catch (error) {
            next();
        }
    }

    async getOrderAdmin(req, res, next) {
        try {
            const order = await Orders.findOne({ _id: req.params.id }).populate("customerOrder paymentOrder deliveryOrder").exec();

            if (!order) {
                return res.status(400).json({ success: false, message: "Pedido não encontrado" });
            }

            order.ordercart = await Promise.all(
                order.ordercart.map(async (item) => {
                    item.productOrder = await Products.findById(item.productOrder);
                    item.variationOrder = await Variations.findById(item.variationOrder);
                    return item;
                })
            );
            const orderReg = await OrderRegistrations.find({ order: order._id });
            return res.status(200).json({ success: true, order, orderReg });
        } catch (error) {
            next();
        }
    }

    async deleteOrderAdmin(req, res) {
        try {
            const order = await Orders.findOne({ _id: req.params.id }).populate("customerOrder paymentOrder deliveryOrder");

            if (!order) {
                return res.status(400).json({ success: false, message: "Pedido não encontrado" });
            }

            if (order.orderCancel === true) {
                return res.status(400).json({ success: false, message: "Esse pedido ja foi cancelado" });
            }
            order.orderCancel = true;
            const orderReg = new OrderRegistrations({
                order: order._id,
                type: "pedido",
                situation: "pedido_cancelado",
            });
            await orderReg.save();

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
                return res.status(404).json({ success: false, message: "Pedido não encontrado" });
            }

            order.ordercart = await Promise.all(
                order.ordercart.map(async (item) => {
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
        const user = req.params.user;

        if (!user) {
            return res.status(400).json({ success: false, message: "Payload ou ID do payload não definidos" });
        }

        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 10,
            sort: { updatedAt: -1 },
            populate: "customer payment delivery orderRegistration address",
        };

        try {
            const customer = await Customers.findOne({ user: user });
            console.log(customer);

            if (!customer) {
                return res.status(400).json({ success: false, message: "Não tem pedidos ainda!" });
            }

            const orders = await Orders.paginate({ customer: customer._id }, options);
            console.log(orders);

            if (!orders) {
                return res.status(400).json({ success: false, message: "Nenhum pedido encontrado" });
            }

            // orders.docs = await Promise.all(
            //     orders.docs.map(async (order) => {
            //         order.ordercart = await Promise.all(
            //             order.ordercart.map(async (item) => {
            //                 item.productOrder = await Products.findById(item.productOrder);
            //                 item.variationOrder = await Variations.findById(item.variationOrder);
            //                 return item;
            //             })
            //         );
            //         return order;
            //     })
            // );
            return res.status(200).json({ success: true, orders });
        } catch (error) {
            next(error);
        }
    }

    async getOrder(req, res, next) {
        try {
            const customer = await Customers.findOne({ user: req.auth._id });

            if (!customer) {
                return res.status(400).json({ success: false, message: "Cliente não encontrado" });
            }

            const order = await Orders.findOne({ customerOrder: customer._id, _id: req.params.id }).populate("customerOrder paymentOrder deliveryOrder").exec();

            if (!order) {
                return res.status(400).json({ success: false, message: "Pedido não encontrado" });
            }

            order.ordercart = await Promise.all(
                order.ordercart.map(async (item) => {
                    item.productOrder = await Products.findById(item.productOrder);
                    item.variationOrder = await Variations.findById(item.variationOrder);
                    return item;
                })
            );

            const orderReg = await OrderRegistrations.find({ order: order._id });
            return res.status(200).json({ success: true, order, orderReg });
        } catch (error) {
            next();
        }
    }

    async createOrder(req, res, next) {
        const { cart, payment, delivery } = req.body;
        const userID = req.auth._id;

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

            const customer = await Customers.findOne({ user: userID });

            if (!customer) {
                const user = await Users.findById(userID).select("-recovery -salt -password -role");

                const customer = new Customers({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    cellNumber: user.cellNumber,
                    user: user._id,
                    cart: user.cart,
                });

                user.customer = customer._id;

                await customer.save();
                await user.save();
            }

            const newPayment = new Payments({
                amount: payment.total,
                totalProductsPrice: payment.totalProductsPrice,
                reference: delivery.reference,
            });

            const newDelivery = new Deliveries({
                cost: payment.shippingPrice,
                address: delivery.address,
            });

            const order = new Orders({
                customer: customer._id,
                cart: cart,
                address: delivery.address,
                payment: newPayment._id,
                delivery: newDelivery._id,
                referenceOrder: delivery.reference,
                totalPrice: payment.total,
                totalProductsPrice: payment.totalProductsPrice,
            });
            const newOrderReg = new OrderRegistrations({
                order: order._id,
                orderStatus: order.status,
            });

            newPayment.order = order._id;
            newDelivery.order = order._id;
            order.orderRegistration = newOrderReg._id;

            await order.save();
            await newPayment.save();
            await newDelivery.save();
            await newOrderReg.save();

            // resetar o carrinho
            const userCart = await Cart.findOne({ cartUser: userID });
            userCart.cartItens = [];
            userCart.save();
            // Notificar via email - cliente e admin = New order

            return res.status(200).json({ success: true, order: Object.assign({}, order._doc, { delivery: newDelivery, payment: newPayment, customer, newOrderReg }) });
        } catch (error) {
            next(error);
        }
    }

    async deleteOrder(req, res) {
        try {
            const customer = await Customers.findOne({ user: req.auth._id });

            if (!customer) {
                return res.status(400).json({ success: false, message: "Cliente não encontrado" });
            }
            const order = await Orders.findOne({ customerOrder: customer._id, _id: req.params.id }).populate("customerOrder paymentOrder deliveryOrder");

            if (!order) {
                return res.status(400).json({ success: false, message: "Pedido não encontrado" });
            }
            if (order.orderCancel === true) {
                return res.status(400).json({ success: false, message: "Esse pedido ja foi cancelado" });
            }
            order.orderCancel = true;

            const orderReg = new OrderRegistrations({
                order: order._id,
                type: "pedido",
                situation: "pedido_cancelado",
            });
            await orderReg.save();

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
            const customer = await Customers.findOne({ user: req.auth._id });

            if (!customer) {
                return res.status(400).json({ success: false, message: "Cliente não encontrado" });
            }

            const order = await Orders.findOne({ customerOrder: customer._id, _id: req.params.id });

            if (!order) {
                return res.status(404).json({ success: false, message: "Pedido não encontrado" });
            }

            order.ordercart = await Promise.all(
                order.ordercart.map(async (item) => {
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
