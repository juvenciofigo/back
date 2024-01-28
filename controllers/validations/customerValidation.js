const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const getAllCustomers = (req, res, next) => {
    const { error } = Joi.object({
        offset: Joi.number(),
        limit: Joi.number(),
    }).validate(req.query);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const searchOrders = (req, res, next) => {
    const paramsSchema = Joi.object({
        search: Joi.string().required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message });
    }
    const querySchema = Joi.object({
        offset: Joi.number(),
        limit: Joi.number(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        console.log(queryError);
        return res.status(400).json({ error: queryError.details[0].message });
    }
    next();
};

const search = (req, res, next) => {
    const paramsSchema = Joi.object({
        search: Joi.string().required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message });
    }
    const querySchema = Joi.object({
        offset: Joi.number(),
        limit: Joi.number(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        console.log(queryError);
        return res.status(400).json({ error: queryError.details[0].message });
    }
    next();
};

const showCustomerAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const showOrdersCustomers = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message });
    }
    const querySchema = Joi.object({
        offset: Joi.number(),
        limit: Joi.number(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        console.log(queryError);
        return res.status(400).json({ error: queryError.details[0].message });
    }
    next();
};



const showCustomer = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};


const removeMySelf = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const mySelf = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const createCustomer = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min(6),
        name: Joi.string().required(),
        nuit: Joi.string().required(),
        contacts: Joi.array().items(Joi.string()),
        address: Joi.object({
            street: Joi.string().required(),
            neighborhood: Joi.string().required(),
            city: Joi.string().required(),
            province: Joi.string().required(),
            reference: Joi.string().required(),
        }).required(),
        birthday: Joi.date().format("YYYY-MM-DD").raw().required(),
    }).validate(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const updateCustomer = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message });
    }
    const bodySchema = Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min(6),
        name: Joi.string().optional(),
        nuit: Joi.string().optional(),
        contacts: Joi.array().items(Joi.string().optional()),
        address: Joi.object({
            street: Joi.string().optional(),
            neighborhood: Joi.string().optional(),
            city: Joi.string().optional(),
            province: Joi.string().optional(),
            reference: Joi.string().optional(),
        }).optional(),
        birthday: Joi.date().format("YYYY-MM-DD").raw().optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        console.log(bodyError);
        return res.status(400).json({ error: bodyError.details[0].message });
    }
    next();
};

const updateCustomerAdmin = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message });
    }
    const bodySchema = Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min(6),
        name: Joi.string().optional(),
        nuit: Joi.string().optional(),
        contacts: Joi.array().items(Joi.string().optional()),
        address: Joi.object({
            street: Joi.string().optional(),
            neighborhood: Joi.string().optional(),
            city: Joi.string().optional(),
            province: Joi.string().optional(),
            reference: Joi.string().optional(),
        }).optional(),
        birthday: Joi.date().format("YYYY-MM-DD").raw().optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        console.log(bodyError);
        return res.status(400).json({ error: bodyError.details[0].message });
    }
    next();
};

module.exports = {
    getAllCustomers,
    searchOrders,
    search,
    showCustomerAdmin,
    showOrdersCustomers,
    showCustomer,
    removeMySelf,
    updateCustomer,
    createCustomer,
    mySelf,
    updateCustomerAdmin,
};
