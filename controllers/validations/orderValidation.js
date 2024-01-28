const Joi = require("joi");
//
//
//
//
const getAllOrdersAdmin = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message });
    }

    const bodySchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
        cart: Joi.array().items(Joi.object({
            productOrder:Joi.string().alphanum().length(24).required(),
            variationOrder:Joi.string().alphanum().length(24).required(),
            priceUnit:Joi.number().required(),
            quantityOrder:Joi.number().required(),
             
        })).required(),
        payment: Joi.object({
            Amount: Joi.number().required(),
            PaymentForm: Joi.string().required(),
            PaymentInstallments: Joi.object().optional(),
            PaymentStatus: Joi.string().optional(),
            paymentOrder: Joi.string().alphanum().length(24).required(),
            payload: Joi.object().optional(),
        }).required(),
        delivery: Joi.object({
            deliveryStatus: Joi.string().optional(),
            deliveryCodeTrack: Joi.string().optional(),
            deliveryType: Joi.string().optional(),
            deliveryCost: Joi.number().required(),
            deliveryDeadline: Joi.number.required(),
            deliveryOrder: Joi.string().alphanum().length(24).required(),
            payload: Joi.object().optional(),
        }).required(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        console.log(bodyError);
        return res.status(400).json({ error: bodyError.details[0].message });
    }

    const querySchema = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        console.log(queryError);
        return res.status(400).json({ error: queryError.details[0].message });
    }
    next();
};
//
//
//
//
//
const getOrderAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const deleteOrderAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
const getOrderCartAdmin = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Customer

const getAllOrders = (req, res, next) => {
    const { error } = Joi.object({
        offset: Joi.number().required(),
        limit: Joi.number().required(),
    }).validate(req.query);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const getOrder = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const createOrder = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const deleteOrder = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const getOrderCart = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
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
