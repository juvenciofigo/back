const { query } = require("express");
const Joi = require("joi");

// Middlewares de validação para pedidos do administrador

const getAllOrdersAdmin = (req, res, next) => {
    const { error } = Joi.object({
        offset: Joi.number().optional(),
        limit: Joi.number().optional(),
        sortType: Joi.string().optional(),
    }).validate(req.query);

    if (error) {
        next(error);
    }
    next();
};

const getOrderAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const deleteOrderAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const getOrderCartAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
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
        console.log(queryError);
        next(queryError);
    }
    if (paramsError) {
        console.log(paramsError);
        next(paramsError);
    }
    next();
};

const createOrder = (req, res, next) => {
    const bodySchema = Joi.object({
        cart: Joi.array()
            .items(
                Joi.object({
                    picture: Joi.string().required(),
                    productId: Joi.string().alphanum().length(24).required(),
                    productName: Joi.string().required(),
                    productPrice: Joi.number().required(),
                    quantity: Joi.number().required(),
                    subtotal: Joi.number().required(),
                    // variation: Joi.string().alphanum().length(24).required(),
                })
            )
            .required(),
        payment: Joi.object({
            total: Joi.number().required(),
            totalProductsPrice: Joi.number().required(),
            shippingPrice: Joi.number().required(),
        }).required(),
        delivery: Joi.object({
            address: Joi.string().alphanum().length(24).required(),
            reference: Joi.string().required(),
        }).required(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        next(bodyError);
    }
    next();
};

const getOrder = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const deleteOrder = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const getOrderCart = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
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
