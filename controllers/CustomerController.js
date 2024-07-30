const Users = require("../models/Users");
const Customers = require("../models/Customers");
const Address = require("../models/Addresses");
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
                return res.status(404).json({ success: false, message: "Nenhum cliente encontrado" });
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
                return res.status(404).json({ message: "Cliente não encontrado." });
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
                return res.status(400).json({ success: false, message: "Nenhum pedido encontrado" });
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
                return res.status(404).json({ message: "Cliente não encontrado." });
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
                return res.status(404).json({ success: false, message: "Cliente não encontrado." });
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
        const { cellNumber } = req.body;

        try {
            const user = await Users.findById(userId).select("-recovery -salt -password -role");

            if (!user.customer) {
                
                const customer = new Customers({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    cellNumber: cellNumber,
                    user: user._id,
                    cart: user.cart,
                });

                user.customer = customer._id;

                await customer.save();
                await user.save();
            }
            return res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    async addAddress(req, res, next) {
        const { userId } = req.params;
        const { firstName, lastName, email, cellNumber, complete, country, province, postalCode, neighborhood, city, reference } = req.body;

        try {
            const user = await Users.findById(userId).select("-recovery -salt -password -role");
            if (!user) {
                return res.status(404).json({ message: "Usuario não encontrado." });
            }

            const newAddress = new Address({ firstName, lastName, email, cellNumber, complete, country, province, postalCode, neighborhood, city, reference, user: user._id });

            let customer = await Customers.findOne({ user: userId }).select("-recovery -salt -password -role");

            if (!customer) {
                const newCustomer = new Customers({ user, firstName, lastName, email, cellNumber, user: user._id, cart: user.cart });
                user.customer = newCustomer._id;
                customer = newCustomer;
                user.save();
            }

            newAddress.customer = customer._id;
            customer.addresses.push(newAddress._id);

            newAddress.save();
            customer.save();

            return res.status(200).json({ addressId: newAddress._id });
        } catch (error) {
            next(error);
        }
    }

    async deleteAddress(req, res, next) {
        const { addressId } = req.params;
        const userId = req.auth._id;
        try {
            const address = await Address.findOne({ _id: addressId, user: userId });
            if (!address) {
                return res.status(404).json({ message: "Falha ao apagar" });
            }
            address.deleted = true;
            await address.save();
            return res.status(200).json({ message: "Endereço deletado com sucesso" });
        } catch (error) {
            next(error);
        }
    }

    async mySelf(req, res, next) {
        try {
            const customer = await Customers.findById(req.params.id).populate({ path: "user" });

            if (!customer) {
                return res.status(404).json({ message: "Cliente não encontrado." });
            }

            return res.send({ customer });
        } catch (error) {
            next(error);
        }
    }
    async allAddress(req, res, next) {
        const { userId } = req.params;
        try {
            const address = await Address.find({ user: userId, deleted: false }).populate({ path: "user" });

            return res.status(200).json(address);
        } catch (error) {
            next(error);
        }
    }

    async updateMySelf(req, res, next) {
        const customerId = req.params.id;
        const { firstName, lastName, email, cellNumber } = req.body;

        try {
            const customer = await Customers.findById(customerId).populate("user");
            const user = await Users.findOne({ customer: customerId });

            if (firstName) {
                customer.firstName = firstName;
                user.firstName = firstName;
            }
            if (lastName) {
                customer.lastName = lastName;
                user.lastName = lastName;
            }
            if (email) {
                customer.email = email;
                user.email = email;
            }
            if (cellNumber) {
                customer.cellNumber = cellNumber;
                user.cellNumber = cellNumber;
            }

            await customer.save();
            await user.save();

            return res.status(200).json({ success: true, customer });
        } catch (error) {
            next(error);
        }
    }

    async removeMySelf(req, res, next) {
        const customerId = req.params.id;
        try {
            const customer = await Customers.findById(req.params.id).populate("user");

            if (!customer) {
                return res.status(404).json({ message: "Cliente não encontrado." });
            }
            const user = await Users.findOne({ customer: customerId });
            if (user) {
                user.deleted = true;
            }

            customer.deleted = true;

            await customer.save();
            await user.save();

            return res.status(200).json({ deleted: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CustomerController();
