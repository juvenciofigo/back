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

    async getAllCustomers(req, res) {
        // Opções de paginação a partir dos parâmetros da consulta (query parameters)
        const options = {
            page: Number(req.query.offset) || 1,
            limit: Number(req.query.limit) || 30,
            populate: {
                path: "user",
                select: "-salt -hash -password",
            },
        };
        try {
            // Obtém clientes paginados usando o modelo Customers e as opções de paginação
            const customers = await Customers.paginate({}, options);

            // Retorna a resposta JSON com os clientes paginados
            return res.json(customers);
        } catch (error) {
            // Em caso de erro, registra o erro no console
            console.error("Erro ao obter clientes:", error);

            // Retorna uma resposta de status 500 (Internal Server Error) em caso de falha
            return res.status(500).json({ error: "Erro ao obter clientes." });
        }
    }

    async searchOrders(req, res) {
        const options = {
            page: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 10,
            populate: ["customerOrder", "paymentOrder", "deliveryOrder"], // Corrigido aqui
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
            // Adicione o tratamento de erro aqui, se necessário
            console.error(error);
            return res.status(500).json({ success: false, error: "Erro interno do servidor" });
        }
    }

    async search(req, res) {
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

            // Retorna a resposta JSON com os clientes encontrados
            return res.status(200).json(customers);
        } catch (error) {
            // Em caso de erro, registra o erro no console
            console.error("Erro ao obter clientes:", error);

            // Retorna uma resposta de status 500 (Internal Server Error) em caso de falha
            return res.status(500).json({ error: "Erro ao obter clientes." });
        }
    }

    async showCustomerAdmin(req, res) {
        try {
            // Busca o cliente pelo ID fornecido nos parâmetros da requisição
            const customer = await Customers.findById(req.params.id).populate({ path: "user" });

            // Verifica se o cliente foi encontrado
            if (!customer) {
                // Retorna uma resposta de status 404 (Not Found) se o cliente não for encontrado
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            // Retorna uma resposta de status 200 (OK) com os detalhes do cliente
            return res.send({ customer });
        } catch (error) {
            // Em caso de erro, registra o erro no console
            console.error("Erro ao buscar o cliente:", error);

            // Retorna uma resposta de status 500 (Internal Server Error) em caso de falha
            return res.status(500).json({ error: "Erro interno ao buscar o cliente." });
        }
    }

    async showOrdersCustomers(req, res) {
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

    async updateAdmin(req, res) {
        const { name, birthday, nuit, email, contacts, address, province, city } = req.body;

        try {
            // Busca o cliente pelo ID fornecido nos parâmetros da requisição
            const customer = await Customers.findById(req.params.id).populate("user");

            // Verifica se o cliente foi encontrado
            if (!customer) {
                // Retorna uma resposta de status 404 (Not Found) se o cliente não for encontrado
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            // Atualiza os dados do cliente com os valores fornecidos no corpo da requisição
            customer.user.name = name;
            customer.name = name;
            customer.birthday = birthday;
            customer.nuit = nuit;
            customer.user.email = email;
            customer.contacts = contacts;
            customer.address = address;
            customer.province = province;
            customer.city = city;

            // Salva as alterações no banco de dados
            await customer.save();

            // Retorna uma resposta de status 200 (OK) com os dados atualizados do cliente
            return res.status(200).json({ customer });
        } catch (error) {
            // Em caso de erro, registra o erro no console
            console.error("Erro ao atualizar cliente:", error);

            // Retorna uma resposta de status 500 (Internal Server Error) em caso de falha
            return res.status(500).json({ error: "Erro interno ao atualizar cliente." });
        }
    }

    async deleteAdmin(req, res) {
        try {
            // Procura um cliente pelo ID fornecido nos parâmetros da requisição
            const customer = await Customers.findById(req.params.id).populate("user");

            // Verifica se o cliente foi encontrado
            if (!customer) {
                return res.status(404).json({ success: false, error: "Cliente não encontrado." });
            }

            // Se o cliente tiver um usuário associado, remove o usuário
            if (customer.user) {
                await customer.user.deleteOne();
            }

            // Define a propriedade 'deleted' do cliente como true
            customer.deleted = true;

            // Salva as alterações no banco de dados
            await customer.save();

            // Retorna uma resposta de status 200 (OK) indicando que o cliente foi removido com sucesso
            return res.status(200).json({ success: true, deleted: true });
        } catch (error) {
            // Em caso de erro, registra o erro no console
            console.error("Erro ao buscar cliente:", error);

            // Retorna uma resposta de status 500 (Internal Server Error) em caso de falha
            return res.status(500).json({ sucesso: false, error: "Erro interno ao buscar cliente." });
        }
    }

    /**
     *
     * CUSTUMERS
     */

    async createCustomer(req, res) {
        const { name, birthday, password, nuit, email, contacts, address } = req.body;

        try {
            // Verificar se o e-mail já está em uso em Customers
            const existingCustomer = await Customers.findOne({ email: email });
            if (existingCustomer) {
                return res.status(422).json({ error: "E-mail já em uso", success: false });
            }
            // Criar novo usuário
            const user = new Users({ name, email });
            await user.setPass(password);
            await user.save();

            // Criar novo cliente
            const customer = new Customers({ email, name, nuit, contacts, address, birthday, user: user._id });
            await customer.save();

            return res.status(200).json({ success: true, client: { ...customer.toObject(), email: user.email } });
        } catch (error) {
            console.error("Erro ao criar usuário e cliente:", error);
            return res.status(500).json({ success: false, error: "Erro interno ao criar usuário e cliente." });
        }
    }

    async mySelf(req, res) {
        try {
            // Busca o cliente pelo ID fornecido nos parâmetros da requisição
            const customer = await Customers.findById(req.params.id).populate({ path: "user" });

            // Verifica se o cliente foi encontrado
            if (!customer) {
                // Retorna uma resposta de status 404 (Not Found) se o cliente não for encontrado
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            // Retorna uma resposta de status 200 (OK) com os detalhes do cliente
            return res.send({ customer });
        } catch (error) {
            // Em caso de erro, registra o erro no console
            console.error("Erro ao buscar o cliente:", error);

            // Retorna uma resposta de status 500 (Internal Server Error) em caso de falha
            return res.status(500).json({ error: "Erro interno ao buscar o cliente." });
        }
    }

    async updateMySelf(req, res) {
        const { name, birthday, password, nuit, email, contacts, address } = req.body;

        try {
            // Verificar se o cliente existe com base no ID do usuário associado ao token
            const customer = await Customers.findById(req.params.id).populate("user");

            // Atualizar informações do cliente
            customer.user.name = name || customer.user.name;
            customer.name = name || customer.name;
            customer.user.email = email || customer.user.email;
            customer.nuit = nuit || customer.nuit;
            customer.contacts = contacts || customer.contacts;
            customer.address = address || customer.address;
            customer.birthday = birthday || customer.birthday;

            // Atualizar senha se fornecida
            if (password) {
                await customer.user.setPass(password);
            }

            // Salvar as alterações
            await customer.save();

            const updatedCustomer = {
                success: true,
                customer,
            };
            return res.status(200).json(updatedCustomer);
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            return res.status(500).json({ error: "Erro interno ao atualizar cliente." });
        }
    }

    async removeMySelf(req, res) {
        try {
            // Busca o cliente pelo ID fornecido nos parâmetros da requisição
            const customer = await Customers.findById(req.params.id).populate("user");

            // Verifica se o cliente foi encontrado
            if (!customer) {
                // Retorna uma resposta de status 404 (Not Found) se o cliente não for encontrado
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            // Se o cliente tiver um usuário associado, remove o usuário
            if (customer.user) {
                await customer.user.deleteOne();
            }

            // Define a propriedade 'deleted' do cliente como true
            customer.deleted = true;

            // Salva as alterações no banco de dados
            await customer.save();

            // Retorna uma resposta de status 200 (OK) indicando que o cliente foi removido com sucesso
            return res.status(200).json({ deleted: true });
        } catch (error) {
            // Em caso de erro, registra o erro no console
            console.error("Erro ao remover cliente:", error);

            // Retorna uma resposta de status 500 (Internal Server Error) em caso de falha
            return res.status(500).json({ error: "Erro interno ao remover cliente." });
        }
    }
}

module.exports = new CustomerController();
