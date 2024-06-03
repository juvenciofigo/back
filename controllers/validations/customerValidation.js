const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const getAllCustomers = (req, res, next) => {
    const { error } = Joi.object({
        offset: Joi.number().optional(),
        limit: Joi.number().optional(),
    }).validate(req.query);

    if (error) {
        next(error);
    }
    next();
};

const removeCustomerAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.number().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const searchOrders = (req, res, next) => {
    const paramsSchema = Joi.object({
        search: Joi.string().required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    const querySchema = Joi.object({
        offset: Joi.number(),
        limit: Joi.number(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        next(error);
    }

    next();
};

const search = (req, res, next) => {
    const paramsSchema = Joi.object({
        search: Joi.string().required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    const querySchema = Joi.object({
        offset: Joi.number(),
        limit: Joi.number(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        next(error);
    }
    next();
};

const showCustomerAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const showOrdersCustomers = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    const querySchema = Joi.object({
        offset: Joi.number(),
        limit: Joi.number(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        next(error);
    }
    next();
};

// Customer

const showCustomer = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const mySelf = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const removeMySelf = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const createCustomer = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().optional(),
        name: Joi.string().required(),
        contacts: Joi.string(),
        address: Joi.object({
            address: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            province: Joi.string().required(),
            reference: Joi.string().optional(),
        }).required(),
    }).validate(req.body);

    if (error) {
        next(error);
    }
    next();
};

const updateCustomer = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    const bodySchema = Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min(6),
        name: Joi.string().optional(),
        nuit: Joi.string().optional(),
        contacts: Joi.array().items(Joi.string().optional()),
        address: Joi.object({
            address: Joi.string().optional(),
            city: Joi.string().optional(),
            province: Joi.string().optional(),
            reference: Joi.string().optional(),
        }).optional(),
        birthday: Joi.date().format("YYYY-MM-DD").raw().optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        next(error);
    }
    next();
};

const updateCustomerAdmin = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    const bodySchema = Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min(6),
        name: Joi.string().optional(),
        nuit: Joi.string().optional(),
        contacts: Joi.array().items(Joi.string().optional()),
        address: Joi.object({
            address: Joi.string().optional(),
            city: Joi.string().optional(),
            province: Joi.string().optional(),
            reference: Joi.string().optional(),
        }).optional(),
        birthday: Joi.date().format("YYYY-MM-DD").raw().optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        next(error);
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
};
