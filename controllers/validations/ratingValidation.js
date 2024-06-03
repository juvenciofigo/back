const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const getAllRatings = (req, res, next) => {
    const { error } = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    }).validate(req.query);

    if (error) {
        next(error);
    }
    next();
};

const getBtId = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    const querySchema = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        next(error);
    }
    next();
};

const Create = (req, res, next) => {
    const bodySchema = Joi.object({
        ratingName: Joi.string().required(),
        ratingText: Joi.string().required(),
        ratingScore: Joi.number().min(1).max(5).required(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        next(error);
    }
    const querySchema = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        next(error);
    }
    next();
};

const Delete = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

module.exports = {
    Create,
    getAllRatings,
    Delete,
    getBtId,
};
