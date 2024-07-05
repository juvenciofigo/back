const OrderRegistrations = require("../models/OrderRegistrations"),
    Deliveries = require("../models/Deliveries"),
    Variations = require("../models/Variations"),
    Customers = require("../models/Customers"),
    Products = require("../models/Products"),
    Payments = require("../models/Payments"),
    Orders = require("../models/Orders"),
    Users = require("../models/Users"),
    Cart = require("../models/Carts"),
    api = require("../config/index").api;

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
        case "createAt-descending":
            return { createdAt: 1 };
        case "createAt-descending":
            return { createdAt: -1 };
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
            sort: getSort(req.query.sortType),
        };

        try {
            const orders = await Orders.paginate({}, options);

            if (!orders.docs || orders.docs.length === 0) {
                return res.status(200).json({ success: true, message: "Nenhum pedido encontrado" });
            }
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
        const authId = req.auth._id;
        const user = req.params.user;

        if (authId !== user) return res.status(400).json({ message: "Sem autorização!" });
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
            const userDetails = await Users.findById(user).select("-recovery -salt -password").populate("cart customer");

            if (userDetails.deleted === true) {
                return res.status(404).json({ message: "Conta apagada!" });
            }

            const customer = await Customers.findOne({ user: user });

            if (!customer) {
                return res.status(400).json({ success: false, message: "Não tem pedidos ainda!" });
            }

            const orders = await Orders.paginate({ customer: customer._id }, options);

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
        const { cart, delivery } = req.body;
        const userID = req.auth._id;
        let cartProducts = [];
        let shippingPrice = 10;

        try {
            // vereficar existencia do carrinho
            const existCart = await Cart.findOne({ cartUser: userID, _id: cart });
            if (!existCart) {
                return res.status(400).json({ success: false, message: "Carrinho inválido!" });
            }

            // verificar se cliente existe e criar, caso nao
            const customer = await Customers.findOne({ user: userID });

            if (!customer) {
                const user = await Users.findById(userID);

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

            // verificar se a referencia do pedido ja existe
            const existOrder = await Orders.findOne({ referenceOrder: delivery.reference });
            if (existOrder) {
                return res.status(400).json({ message: "Referência existente, vá para pedidos" });
            }
            //  prcessar cada item do carrinho
            for (const product of existCart.cartItens) {
                const productDetails = await Products.findById(product.productId);

                if (!productDetails) {
                    throw new Error(`Product com ID ${product.productId} not found`);
                }

                // buscar por variacoes
                const color = await Variations.findById(product.variation.color);
                const model = await Variations.findById(product.variation.model);
                const size = await Variations.findById(product.variation.size);
                const material = await Variations.findById(product.variation.material);

                // calculcar o preco total do produto com base nas variacoes
                let price = 0;

                if (color) {
                    price += color.variationPrice;
                }
                if (model) {
                    price += model.variationPrice;
                }
                if (material) {
                    price += material.variationPrice;
                }
                if (size) {
                    price += size.variationPrice;
                }

                let productPrice = (productDetails.productPrice += price);
                let subtotal = productPrice * product.quantity;
                console.log("productDetails.productName", typeof productDetails.productName);
                cartProducts.push({
                    item: product.item,
                    productId: productDetails._id,
                    product: productDetails.productName,
                    variation: {
                        color: color ? color : null,
                        model: model ? model : null,
                        size: size ? size : null,
                        material: material ? material : null,
                    },
                    picture: `${api}/public/images/${productDetails.productImage[0]}`,
                    productPrice: productPrice,
                    quantity: Number(product.quantity),
                    subtotal: subtotal,
                });
            }

            // calcular o preco total dos produtos
            const totalProductsPrice = cartProducts.reduce((total, product) => total + product.subtotal, 0);

            // criar novo pagamento
            const newPayment = new Payments({
                amount: shippingPrice + totalProductsPrice,
                totalProductsPrice: totalProductsPrice,
                reference: delivery.reference,
            });

            // criar nova entrega
            const newDelivery = new Deliveries({
                cost: shippingPrice,
                address: delivery.address,
            });

            // criar e salvar novo pedido
            const order = new Orders({
                customer: customer._id,
                cart: cartProducts,
                address: delivery.address,
                payment: newPayment._id,
                delivery: newDelivery._id,
                referenceOrder: delivery.reference,
                totalPrice: shippingPrice + totalProductsPrice,
                totalProductsPrice: totalProductsPrice,
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
            existCart.cartItens = [];
            existCart.save();

            return res.status(200).json({
                success: true,
                order: {
                    ...order._doc,
                    delivery: newDelivery,
                    payment: newPayment,
                    customer,
                    newOrderReg,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async updateOrders(req, res, next) {
        try {
            const result = await Orders.updateMany(
                { deleted: { $exists: false } }, // Filtra documentos que ainda não possuem o novo campo
                { $set: { deleted: false } } // Define um valor padrão para o novo campo
            );

            console.log(`${result.modifiedCount} documentos atualizados`);
            return res.status(200).json({ result, count: result.matchedCount });
        } catch (error) {
            next(error);
        }
    }

    async deleteOrder(req, res, next) {
        const orderId = req.params.id;
        try {
            const customer = await Customers.findOne({ user: req.auth._id });

            if (!customer) {
                return res.status(400).json({ success: false, message: "Cliente não encontrado" });
            }

            const order = await Orders.findOne({ customer: customer._id, _id: orderId }).populate("payment delivery orderRegistration");

            if (!order) {
                return res.status(400).json({ success: false, message: "Pedido não encontrado" });
            }
            const payment = await Payments.findOne({ order: orderId });
            const delivery = await Deliveries.findOne({ order: orderId });
            const reg = await OrderRegistrations.findOne({ order: orderId });

            if (order.payment.status === "Esperando") {
                await payment.deleteOne();
                await delivery.deleteOne();
                await reg.deleteOne();
                await order.deleteOne();
            } else {
                payment.status = "Pedido Cancelado";
                order.status = "Pedido Cancelado";
                reg.orderStatus = "Pedido Cancelado";
                payment.save();
                order.save();
                reg.save();
            }

            return res.status(200).json({ message: "Pedido apagado" });
        } catch (error) {
            next(error);
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
            next(error);
        }
    }
}

module.exports = new OrderController();
