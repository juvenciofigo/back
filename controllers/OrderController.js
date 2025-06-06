const OrderRegistrations = require("../models/OrderRegistrations"),
    Deliveries = require("../models/Deliveries"),
    Variations = require("../models/Variations"),
    Customers = require("../models/Customers"),
    { Products } = require("../models/Products/Products"),
    Payments = require("../models/Payments"),
    Orders = require("../models/Orders"),
    Users = require("../models/Users"),
    Cart = require("../models/Carts");

const getSort = (sortType) => {
    switch (sortType) {
        case "alphabet_a-z":
            return { productName: 1 };
        case "alphabet_z-a":
            return { productName: -1 };
        case "price-ascending":
            return { productPrice: 1 };
        case "createAt-aescending":
            return { createdAt: 1 };
        case "price-descending":
            return { productPrice: -1 };
        case "createAt-descending":
            return { createdAt: -1 };
        default:
            return { updatedAt: -1 };
    }
};

// gerear referencia
async function gerReferenceNumeber() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const caracteresLength = caracteres.length;
    const minSize = 6;
    const maxSize = 20;

    // Gerar um timestamp único
    const timestamp = new Date().getTime().toString();

    // Gerar um número aleatório de caracteres
    const numeroAleatorio = Array.from({ length: maxSize }, () => caracteres.charAt(Math.floor(Math.random() * caracteresLength))).join("");

    // Calcula o tamanho do número de referência
    const tamanho = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

    // Combinar o timestamp e o número aleatório para formar o número de referência
    const numeroReferencia = `${timestamp}${numeroAleatorio}`.slice(0, tamanho);

    return numeroReferencia;
}

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
            next(error);
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
            next(error);
        }
    }

    async deleteOrderAdmin(req, res, next) {
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
            next(error);
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
            next(error);
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
            page: Number(req.query.offset) || 1,
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

            const orders = await Orders.paginate({ customer: customer._id, deleted: false }, options);

            if (orders.total === 0) {
                return res.status(404).json({ success: false, message: "Nenhum pedido encontrado" });
            }

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
            next(error);
        }
    }

    async createOrder(req, res, next) {
        const { cart, address } = req.body;
        const userID = req.auth._id;
        let cartProducts = [];
        let shippingPrice = 0;

        const session = await Orders.startSession();
        session.startTransaction(); // Iniciar transação

        try {
            // Verificar existência do carrinho
            const existCart = await Cart.findOne({ cartUser: userID, _id: cart }).session(session);

            if (!existCart) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: "Carrinho inválido!" });
            }

            // Verificar se cliente existe e criar se necessário
            let customer = await Customers.findOne({ user: userID }).session(session);

            if (!customer) {
                const user = await Users.findById(userID).select("-recovery -salt -password -role -cart -createdAt -deleted -updatedAt");

                return res.status(202).json({ user: user, message: "Cliente não encontrado." });
            }

        
            // Gerar referência única para o pedido
            async function generateUniqueReference() {
                let reference;
                let existOrder;
                do {
                    reference = await gerReferenceNumeber();
                    existOrder = await Orders.findOne({ referenceOrder: reference }).session(session);
                } while (existOrder);
                return reference;
            }
            const reference = await generateUniqueReference();

            // Processar cada item do carrinho
            for (const item of existCart.cartItens) {
                const product = await Products.findById(item.productId).session(session);

                if (!product) continue;

                const estimate = product?.deliveryEstimate?.id(item.deliveryEstimate);
                const color = await Variations.findById(item.variation.color).session(session);
                const model = await Variations.findById(item.variation.model).session(session);
                const size = await Variations.findById(item.variation.size).session(session);
                const material = await Variations.findById(item.variation.material).session(session);

                let price = 0;

                if (estimate?.additionalCost) price += estimate?.additionalCost;
                if (color) price += color.variationPrice;
                if (model) price += model.variationPrice;
                if (material) price += material.variationPrice;
                if (size) price += size.variationPrice;

                let itemPrice = Number((product.productPrice += price));
                cartProducts.push({
                    item: item.item,
                    productId: product._id,
                    product: product.productName,
                    variation: { color, model, size, material },
                    picture: product.productImage[0],
                    itemPrice,
                    deliveryEstimate: estimate,
                    quantity: Number(item.quantity),
                    subtotal: Number(itemPrice * item.quantity),
                });
            }

            const totalProductsPrice = cartProducts.reduce((total, product) => total + product.subtotal, 0);

            // Criar novo pagamento
            const newPayment = new Payments({
                amount: shippingPrice + totalProductsPrice,
                totalProductsPrice,
                reference,
            });

            // Criar nova entrega
            const newDelivery = new Deliveries({
                cost: shippingPrice,
                address: address,
            });

            // Criar novo pedido
            const order = new Orders({
                customer: customer._id,
                cart: cartProducts,
                address: address,
                payment: newPayment._id,
                delivery: newDelivery._id,
                referenceOrder: reference,
            });

            const newOrderReg = new OrderRegistrations({
                order: order._id,
                orderStatus: order.status,
            });

            newPayment.order = order._id;
            newDelivery.order = order._id;
            order.orderRegistration = newOrderReg._id;

            // Salvar tudo dentro da transação
            await order.save({ session });
            await newPayment.save({ session });
            await newDelivery.save({ session });
            await newOrderReg.save({ session });

            // Resetar o carrinho
            existCart.cartItens = [];
            await existCart.save({ session });

            // Confirmar a transação
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                message: "Pedido enviado",
                order: {
                    ...order._doc,
                    delivery: newDelivery,
                    payment: newPayment,
                    customer,
                    newOrderReg,
                },
            });
        } catch (error) {
            // Se ocorrer erro, desfaz todas as operações
            await session.abortTransaction();
            session.endSession();
            next(error);
        }
    }

    async updateOrders(req, res, next) {
        try {
            const result = await Orders.updateMany(
                { deleted: { $exists: false } }, // Filtra documentos que ainda não possuem o novo campo
                { $set: { deleted: false } } // Define um valor padrão para o novo campo
            );

            return res.status(200).json({ result, count: result.matchedCount });
        } catch (error) {
            next(error);
        }
    }

    async deleteOrder(req, res, next) {
        const orderId = req.params.id;
        const userId = req.auth._id;

        try {
            const customer = await Customers.findOne({ user: userId });

            if (!customer) {
                return res.status(400).json({ success: false, message: "Cliente não encontrado" });
            }

            const order = await Orders.findOne({ customer: customer._id, _id: orderId }).populate("payment");

            if (!order) {
                return res.status(400).json({ success: false, message: "Pedido não encontrado" });
            }

            if (order.payment.status === "Pago") {
                order.deleted = true;
                await order.save();
            } else {
                await Promise.all([
                    Payments.deleteOne({ order: orderId }),
                    Deliveries.deleteOne({ order: orderId }),
                    OrderRegistrations.deleteOne({ order: orderId }),
                    Orders.deleteOne({ _id: orderId }),
                ]);
            }

            return res.status(200).json({ success: true, message: "Pedido apagado com sucesso" });
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
