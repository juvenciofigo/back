const Joi = require("joi");

// Middlewares de validação para pedidos do administrador

const getAllOrdersAdmin = (req, res, next) => {
    const { error } = Joi.object({
        offset: Joi.number().optional(),
        limit: Joi.number().optional(),
        sortType: Joi.string().optional(),
    }).validate(req.query);

    if (error) {
         console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const getOrderAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
         console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const deleteOrderAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
         console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const getOrderCartAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
         console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

// Middlewares de validação para pedidos do cliente

const getAllOrders = (req, res, next) => {
    const { queryError } = Joi.object({
        offset: Joi.number().optional(),
        limit: Joi.number().optional(),
    }).validate(req.query);

    const { paramsError } = Joi.object({
        user: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (queryError) {
        next(queryError);
    }
    if (paramsError) {
        next(paramsError);
    }
    next();
};

const createOrder = (req, res, next) => {
    const schema = Joi.object({
        cart: Joi.string().alphanum().length(24).required(),
        address: Joi.string().alphanum().length(24).required(),
    });

    const data = { ...req.body };
    const { error } = schema.validate(data);

    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const getOrder = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
         console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const deleteOrder = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
         console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const getOrderCart = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
         console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    getAllOrdersAdmin,
    getOrderAdmin,
    deleteOrderAdmin,
    getOrderCartAdmin,
    getAllOrders,
    getOrder,
    createOrder,
    deleteOrder,
    getOrderCart,
};