const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const authenticateUser = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const show = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const create = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const update = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }
    const bodySchema = Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().optional().min().min(6),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        return res.status(400).json({ message: bodyError.details[0].message });
    }

    next();
};

module.exports = { authenticateUser, show, create, update };
