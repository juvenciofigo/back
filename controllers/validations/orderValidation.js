const Joi = require("joi");

// Middlewares de validação para pedidos do administrador

const getAllOrdersAdmin = (req, res, next) => {
    const { error } = Joi.object({
        offset: Joi.number().optional(),
        limit: Joi.number().optional(),
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
    const { error } = Joi.object({
        offset: Joi.number().optional(),
        limit: Joi.number().optional(),
    }).validate(req.query);

    if (error) {
        next(error);
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
            Amount: Joi.number().required(),
            PaymentForm: Joi.string().optional(),
            PaymentInstallments: Joi.object().optional(),
            PaymentStatus: Joi.string().optional(),
            paymentOrder: Joi.string().alphanum().length(24).optional(),
            payload: Joi.object().optional(),
        }).required(),
        delivery: Joi.object({
            deliveryStatus: Joi.string().optional(),
            // deliveryCodeTrack: Joi.string().optional(),
            // deliveryType: Joi.string().required(),
            deliveryCost: Joi.number().required(),
            referenceOrder: Joi.string().required(),
            // deliveryDeadline: Joi.number().required(),
            deliveryOrder: Joi.string().alphanum().length(24).optional(),
            payload: Joi.object().optional(),
        }).required(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        next(error);
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
