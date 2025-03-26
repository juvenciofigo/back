const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const getAllCustomers = (req, res, next) => {
    const { error } = Joi.object({
        offset: Joi.number().optional().messages({
            "number.base": "O offset deve ser um número",
        }),
        limit: Joi.number().optional().messages({
            "number.base": "O limite deve ser um número",
        }),
    }).validate(req.query);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const removeCustomerAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required().messages({
            "string.base": "ID deve ser uma string",
            "string.alphanum": "ID deve conter apenas caracteres alfanuméricos",
            "string.length": "ID deve ter 24 caracteres",
            "any.required": "ID é obrigatório",
        }),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const searchOrders = (req, res, next) => {
    const schema = Joi.object({
        search: Joi.string().required().messages({
            "string.base": "A pesquisa deve ser um texto",
            "any.required": "Campo pesquisa é obrigatório",
        }),
        offset: Joi.number().messages({
            "number.base": "Offset deve ser um número",
        }),
        limit: Joi.number().messages({
            "number.base": "Limit deve ser um número",
        }),
    });

    const data = { ...req.query, ...req.body };
    const { error } = schema.validate(data);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

const search = (req, res, next) => {
    const schema = Joi.object({
        search: Joi.string().required().messages({
            "string.base": "A pesquisa deve ser um texto",
            "any.required": "Campo pesquisa é obrigatório",
        }),
        offset: Joi.number().messages({
            "number.base": "Offset deve ser um número",
        }),
        limit: Joi.number().messages({
            "number.base": "Limit deve ser um número",
        }),
    });

    const data = { ...req.query, ...req.body };
    const { error } = schema.validate(data);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

const showCustomerAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required().messages({
            "string.base": "ID deve ser uma string",
            "string.alphanum": "ID deve conter apenas caracteres alfanuméricos",
            "string.length": "ID deve ter 24 caracteres",
            "any.required": "ID é obrigatório",
        }),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const showOrdersCustomers = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().alphanum().length(24).required().messages({
            "string.base": "ID deve ser uma string",
            "string.alphanum": "ID deve conter apenas caracteres alfanuméricos",
            "string.length": "ID deve ter 24 caracteres",
            "any.required": "ID é obrigatório",
        }),
        offset: Joi.number().messages({
            "number.base": "Offset deve ser um número",
        }),
        limit: Joi.number().messages({
            "number.base": "Limit deve ser um número",
        }),
    });

    const data = { ...req.query, ...req.body };
    const { error } = schema.validate(data);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

// Customer

const showCustomer = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required().messages({
            "string.base": "ID deve ser uma string",
            "string.alphanum": "ID deve conter apenas caracteres alfanuméricos",
            "string.length": "ID deve ter 24 caracteres",
            "any.required": "ID é obrigatório",
        }),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const mySelf = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required().messages({
            "string.base": "ID deve ser uma string",
            "string.alphanum": "ID deve conter apenas caracteres alfanuméricos",
            "string.length": "ID deve ter 24 caracteres",
            "any.required": "ID é obrigatório",
        }),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const removeMySelf = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required().messages({
            "string.base": "ID deve ser uma string",
            "string.alphanum": "ID deve conter apenas caracteres alfanuméricos",
            "string.length": "ID deve ter 24 caracteres",
            "any.required": "ID é obrigatório",
        }),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const createCustomer = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.string().alphanum().length(24).required().messages({
            "string.base": "UserID deve ser uma string",
            "string.alphanum": "UserID deve ser alfanumérico",
            "string.length": "UserID deve ter 24 caracteres",
            "any.required": "UserID é obrigatório",
        }),
        cellNumber: Joi.string().required().messages({
            "string.base": "Telefone deve ser um texto",
            "any.required": "Telefone é obrigatório",
        }),
        province: Joi.string().required().messages({
            "string.base": "Província deve ser um texto",
            "any.required": "Província é obrigatória",
        }),
        city: Joi.string().required().messages({
            "string.base": "Cidade deve ser um texto",
            "any.required": "Cidade é obrigatória",
        }),
    });

    const data = { ...req.params, ...req.body };
    const { error } = schema.validate(data);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

const updateCustomer = (req, res, next) => {
    const bodySchema = Joi.object({
        id: Joi.string().alphanum().length(24).required().messages({
            "string.base": "ID deve ser uma string",
            "string.alphanum": "ID deve conter apenas caracteres alfanuméricos",
            "string.length": "ID deve ter 24 caracteres",
            "any.required": "ID é obrigatório",
        }),
        email: Joi.string().email().optional().messages({
            "string.base": "Email deve ser um texto",
            "string.email": "Email inválido",
        }),
        password: Joi.string().optional().min(6).messages({
            "string.base": "Senha deve ser um texto",
            "string.min": "Senha deve ter pelo menos 6 caracteres",
        }),
        name: Joi.string().optional().messages({
            "string.base": "Nome deve ser um texto",
        }),
        nuit: Joi.string().optional().messages({
            "string.base": "NUIT deve ser um texto",
        }),
        contacts: Joi.array()
            .items(
                Joi.string().optional().messages({
                    "string.base": "Contato deve ser um texto",
                })
            )
            .messages({
                "array.base": "Contatos deve ser uma lista",
            }),
        address: Joi.object({
            address: Joi.string().optional().messages({
                "string.base": "Endereço deve ser um texto",
            }),
            city: Joi.string().optional().messages({
                "string.base": "Cidade deve ser um texto",
            }),
            province: Joi.string().optional().messages({
                "string.base": "Província deve ser um texto",
            }),
            reference: Joi.string().optional().messages({
                "string.base": "Referência deve ser um texto",
            }),
        })
            .optional()
            .messages({
                "object.base": "Endereço deve ser um objeto",
            }),
        birthday: Joi.date().format("YYYY-MM-DD").raw().optional().messages({
            "date.format": "Data de nascimento deve estar no formato AAAA-MM-DD",
        }),
    });

    const data = { ...req.params, ...req.body };
    const { error } = bodySchema.validate(data);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

const updateCustomerAdmin = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().alphanum().length(24).required().messages({
            "string.base": "ID deve ser uma string",
            "string.alphanum": "ID deve conter apenas caracteres alfanuméricos",
            "string.length": "ID deve ter 24 caracteres",
            "any.required": "ID é obrigatório",
        }),
        email: Joi.string().email().optional().messages({
            "string.base": "Email deve ser um texto",
            "string.email": "Email inválido",
        }),
        password: Joi.string().optional().min(6).messages({
            "string.base": "Senha deve ser um texto",
            "string.min": "Senha deve ter pelo menos 6 caracteres",
        }),
        name: Joi.string().optional().messages({
            "string.base": "Nome deve ser um texto",
        }),
        nuit: Joi.string().optional().messages({
            "string.base": "NUIT deve ser um texto",
        }),
        contacts: Joi.array()
            .items(
                Joi.string().optional().messages({
                    "string.base": "Contato deve ser um texto",
                })
            )
            .messages({
                "array.base": "Contatos deve ser uma lista",
            }),
        address: Joi.object({
            address: Joi.string().optional().messages({
                "string.base": "Endereço deve ser um texto",
            }),
            city: Joi.string().optional().messages({
                "string.base": "Cidade deve ser um texto",
            }),
            province: Joi.string().optional().messages({
                "string.base": "Província deve ser um texto",
            }),
            reference: Joi.string().optional().messages({
                "string.base": "Referência deve ser um texto",
            }),
        })
            .optional()
            .messages({
                "object.base": "Endereço deve ser um objeto",
            }),
        birthday: Joi.date().format("YYYY-MM-DD").raw().optional().messages({
            "date.format": "Data de nascimento deve estar no formato AAAA-MM-DD",
        }),
    });

    const data = { ...req.params, ...req.body };
    const { error } = schema.validate(data);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

const addAddress = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.string().alphanum().length(24).required().messages({
            "string.base": "UserID deve ser uma string",
            "string.alphanum": "UserID deve ser alfanumérico",
            "string.length": "UserID deve ter 24 caracteres",
            "any.required": "UserID é obrigatório",
        }),
        firstName: Joi.string().required().messages({
            "string.base": "Nome deve ser um texto",
            "any.required": "Nome é obrigatório",
        }),
        lastName: Joi.string().required().messages({
            "string.base": "Sobrenome deve ser um texto",
            "any.required": "Sobrenome é obrigatório",
        }),
        email: Joi.string().email().optional().messages({
            "string.base": "Email deve ser um texto",
            "string.email": "Email inválido",
        }),
        cellNumber: Joi.string().required().messages({
            "string.base": "Telefone deve ser um texto",
            "any.required": "Telefone é obrigatório",
        }),
        complete: Joi.string().required().messages({
            "string.base": "Endereço completo deve ser um texto",
            "any.required": "Endereço completo é obrigatório",
        }),
        province: Joi.string().required().messages({
            "string.base": "Província deve ser um texto",
            "any.required": "Província é obrigatória",
        }),
        postalCode: Joi.number().required().messages({
            "string.base": "Código postal deve ser um texto",
            "any.required": "Código postal é obrigatório",
        }),
        city: Joi.string().required().messages({
            "string.base": "Cidade deve ser um texto",
            "any.required": "Cidade é obrigatória",
        }),
        reference: Joi.string().required().messages({
            "string.base": "Referência deve ser um texto",
            "any.required": "Referência é obrigatória",
        }),
        note: Joi.string().optional().messages({
            "string.base": "Nota deve ser um texto",
        }),
    });

    const data = { ...req.params, ...req.body };
    const { error } = schema.validate(data);

    if (error) {
        console.log("falha validacao");
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

module.exports = {
    getAllCustomers,
    search,
    searchOrders,
    showCustomerAdmin,
    showOrdersCustomers,
    updateCustomerAdmin,
    removeCustomerAdmin,
    ///  customer
    mySelf,
    createCustomer,
    updateCustomer,
    removeMySelf,
    showCustomer,
    addAddress,
};
