const Users = require("../models/Users");
const Customers = require("../models/Customers");
const Address = require("../models/Addresses");
const Orders = require("../models/Orders");
const { Products } = require("../models/Products/Products");
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
        const { id } = req.params;
        const { cellNumber, province, city } = req.body;

        try {
            const user = await Users.findById(id).select("-recovery -salt -password -role");

            if (!user) {
                return res.status(400).json({ message: "Usuário não encontrado!" });
            }
            if (user.customer) {
                return res.status(400).json({ message: "Cliente existente" });
            }

            const customer = new Customers({
                cellNumber,
                province,
                city,
                user: user._id,
            });
            user.customer = customer._id;
            await customer.save();
            await user.save();
            return res.status(200).json({ success: true, message: "Cliente Criado!" });
        } catch (error) {
            next(error);
        }
    }

    async addAddress(req, res, next) {
        const { id } = req.params;
        const { firstName, lastName, email, cellNumber, complete, province, postalCode, city, reference } = req.body;

        try {
            const user = await Users.findById(id).select("-recovery -salt -password -role -cart -createdAt -deleted -updatedAt");

            if (!user) {
                return res.status(404).json({ message: "Usuario não encontrado." });
            }

            let customer = await Customers.findOne({ user: id });

            if (!customer) {
                return res.status(202).json({ user: user, message: "Complete seu perfil!" });
            }

            const address = new Address({ firstName, lastName, email, cellNumber, complete, province, postalCode, city, reference, user: user._id });

            address.customer = customer._id;
            customer.addresses.push(address._id);

            await address.save();
            await Customers.updateOne({ _id: customer._id }, { $push: { addresses: address._id } });

            const addresses = await Address.find({ user: id, deleted: false });

            return res.status(200).json({ message: "Endereço adicionado", addresses, address });
        } catch (error) {
            next(error);
        }
    }

    async deleteAddress(req, res, next) {
        const { addressId } = req.params;
        const id = req.auth._id;

        // Validação básica dos parâmetros
        if (!addressId || !id) {
            return res.status(400).json({ message: "Parâmetros inválidos" });
        }

        try {
            // Atualiza o endereço diretamente no banco de dados
            const updatedAddress = await Address.findOneAndUpdate(
                { _id: addressId, user: id }, // Filtro
                { deleted: true }, // Atualização
                { new: true } // Retorna o documento atualizado
            );

            // Verifica se o endereço foi encontrado e atualizado
            if (!updatedAddress) {
                return res.status(404).json({ message: "Endereço não encontrado ou não pertence ao usuário" });
            }

            // Busca os endereços ativos do usuário
            const addresses = await Address.find({ user: id, deleted: false });

            // Retorna a resposta com os endereços atualizados
            return res.status(200).json({
                message: "Endereço apagado com sucesso",
                addresses: addresses,
            });
        } catch (error) {
            // Tratamento de erros
            console.error("Erro ao apagar endereço:", error);
            next(error); // Passa o erro para o middleware de tratamento de erros
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
        const { id } = req.params;
        try {
            const addresses = await Address.find({ user: id, deleted: false });

            return res.status(200).json(addresses);
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
