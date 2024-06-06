const Users = require("../models/Users");
const Customers = require("../models/Customers");
const Orders = require("../models/Orders");
const Products = require("../models/Products");
const Variations = require("../models/Variations");

class CustomerController {
    /**
     *
     * ADMIN
     */

    async getAllCustomers(req, res, next) {
        const options = {
            page: Number(req.query.offset) || 1,
            limit: Number(req.query.limit) || 30,
            populate: {
                path: "user",
                select: "-salt -hash -password",
            },
        };
        try {
            const customers = await Customers.paginate({}, options);

            return res.json(customers);
        } catch (error) {
            next(error);
        }
    }

    async searchOrders(req, res, next) {
        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 10,
            populate: ["customerOrder", "paymentOrder", "deliveryOrder"],
        };

        try {
            const search = new RegExp(req.params.search, "i");

            const customers = await Customers.paginate({ $or: [{ name: { $regex: search } }] });

            if (!customers || customers.docs.length === 0) {
                return res.status(404).json({ success: false, error: "Nenhum cliente encontrado" });
            }

            const orders = await Orders.paginate(
                {
                    customerOrder: {
                        $in: customers.docs.map((item) => item._id),
                    },
                },
                options
            );

            await Promise.all(
                orders.docs.map(async (order) => {
                    order.ordercart = await Promise.all(
                        order.ordercart.map(async (item) => {
                            item.productOrder = await Products.findById(item.productOrder);
                            item.variationOrder = await Variations.findById(item.variationOrder);
                            return item;
                        })
                    );
                })
            );
            return res.status(200).json({ success: true, orders });
        } catch (error) {
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            // Configuração das opções de paginação a partir dos parâmetros da consulta (query parameters)
            const options = {
                page: Number(req.query.offset) || 0, // Página padrão 1 se offset não fornecido
                limit: Number(req.query.limit) || 30,
                populate: "user",
            };

            // Cria uma expressão regular (RegExp) para realizar a busca com "i" para ignorar maiúsculas/minúsculas
            const search = new RegExp(req.params.search, "i");

            // Realiza a busca paginada utilizando o modelo Customers e as opções configuradas
            const customers = await Customers.paginate(
                { name: { $regex: search } }, // Condição de busca
                options // Opções de paginação
            );

            return res.status(200).json(customers);
        } catch (error) {
            next(error);
        }
    }

    async showCustomerAdmin(req, res, next) {
        try {
            const customer = await Customers.findById(req.params.id).populate({ path: "user" });

            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            return res.send({ customer });
        } catch (error) {
            next(error);
        }
    }

    async showOrdersCustomers(req, res, next) {
        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 30,
            populate: ["customerOrder paymentOrder deliveryOrder"],
        };

        try {
            const orders = await Orders.paginate({ customerOrder: req.params.id }, options);

            if (!orders.docs || orders.docs.length === 0) {
                return res.status(400).json({ success: false, error: "Nenhum pedido encontrado" });
            }

            await Promise.all(
                orders.docs.map(async (order) => {
                    order.ordercart = await Promise.all(
                        order.ordercart.map(async (item) => {
                            item.productOrder = await Products.findById(item.productOrder);
                            item.variationOrder = await Variations.findById(item.variationOrder);
                            return item;
                        })
                    );
                })
            );

            return res.status(200).json({ success: true, orders });
        } catch (error) {
            next(error);
        }
    }

    async updateAdmin(req, res, next) {
        const { name, email, contacts, address, province, city } = req.body;

        try {
            const customer = await Customers.findById(req.params.id).populate("user");

            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            customer.user.name = name;
            customer.name = name;
            customer.user.email = email;
            customer.contacts = contacts;
            customer.address = address;
            customer.province = province;
            customer.city = city;

            await customer.save();

            return res.status(200).json({ customer });
        } catch (error) {
            next(error);
        }
    }

    async deleteAdmin(req, res, next) {
        try {
            const customer = await Customers.findById(req.params.id).populate("user");

            if (!customer) {
                return res.status(404).json({ success: false, error: "Cliente não encontrado." });
            }

            if (customer.user) {
                await customer.user.deleteOne();
            }

            customer.deleted = true;

            await customer.save();

            return res.status(200).json({ success: true, deleted: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     * CUSTUMERS
     */

    async createCustomer(req, res, next) {
        const { userId } = req.params;
        const { name, email, contacts, address } = req.body;

        try {
            const user = await Users.findById(userId).select("-recovery -salt -password -role");
            if (!user.customer) {
                const customer = new Customers({ email, name, contacts, address, user: user._id });
                user.customer = customer._id;
                await customer.save();
                await user.save();
            }
            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    async mySelf(req, res, next) {
        try {
            const customer = await Customers.findById(req.params.id).populate({ path: "user" });

            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            return res.send({ customer });
        } catch (error) {
            next(error);
        }
    }
    async deliveryData(req, res, next) {
        const { userId } = req.params;
        try {
            const user = await Users.findById(userId).select("-recovery -salt -password -role").populate({ path: "customer" });
            if (user.customer) {
                return res.send({ customer: user.customer });
            } else {
                return res.send(false);
            }
        } catch (error) {
            next(error);
        }
    }

    async updateMySelf(req, res, next) {
        const { name, email, contacts, address } = req.body;

        try {
            const customer = await Customers.findById(req.params.id).populate("user");

            customer.user.name = name || customer.user.name;
            customer.name = name || customer.name;
            customer.user.email = email || customer.user.email;
            customer.contacts = contacts || customer.contacts;
            customer.address = address || customer.address;

            await customer.save();

            const updatedCustomer = {
                success: true,
                customer,
            };
            return res.status(200).json(updatedCustomer);
        } catch (error) {
            next(error);
        }
    }

    async removeMySelf(req, res, next) {
        try {
            const customer = await Customers.findById(req.params.id).populate("user");

            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            if (customer.user) {
                await customer.user.deleteOne();
            }

            customer.deleted = true;

            await customer.save();

            return res.status(200).json({ deleted: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CustomerController();
