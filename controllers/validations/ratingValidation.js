const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const getAllRatings = (req, res, next) => {
    const { error } = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    }).validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const getBtId = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }
    const querySchema = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        return res.status(400).json({ message: queryError.details[0].message });
    }
    next();
};

const Create = (req, res, next) => {
    const bodySchema = Joi.object({
        ratingText: Joi.string().required(),
        ratingScore: Joi.number().min(1).max(5).required(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        return res.status(400).json({ message: bodyError.details[0].message });
    }
    const paramsSchema = Joi.object({
        productId: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }
    next();
};

const PerpenteDelete = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const Delete = (req, res, next) => {
    const paramsSchema = Joi.object({
        RatingId: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(false);
        return res.status(400).json({ message: paramsError.details[0].message });
    }
    next();
    
};

module.exports = {
    Create,
    getAllRatings,
    Delete,
    PerpenteDelete,
    getBtId,
};
