const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const authenticateUser = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    }).validate(req.body);

    if (error) {
        next(error);
    }
    next();
};

const show = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const create = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        name: Joi.string(),
    }).validate(req.body);

    if (error) {
        next(error);
    }
    next();
};

const update = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    const bodySchema = Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min().min(6),
        name: Joi.string().optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        next(error);
    }

    next();
};

module.exports = { authenticateUser, show, create, update };
