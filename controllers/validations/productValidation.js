const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const Create = (req, res, next) => {
    const { error } = Joi.object({
        productName: Joi.string().required(),
        productDescription: Joi.string().required(),
        productPrice: Joi.number().required(),
        productCategory: Joi.string().alphanum().length(24).required(),
        productPromotion: Joi.number(),
        sku: Joi.string(),
    }).validate(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const Update = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message });
    }
    const bodySchema = Joi.object({
        productName: Joi.string().optional(),
        productDescription: Joi.string().optional(),
        productPrice: Joi.number().optional(),
        productCategory: Joi.string().alphanum().length(24).optional(),
        productPromotion: Joi.number().optional(),
        productAvailability: Joi.boolean().optional(),
        sku: Joi.string().optional(),
        productStock: Joi.boolean().optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        console.log(bodyError);
        return res.status(400).json({ error: bodyError.details[0].message });
    }
    next();
};

const Image = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const Delete = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const getBtId = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const All = (req, res, next) => {
    const { error } = Joi.object({
        limit: Joi.number().optional(),
        offset: Joi.number().optional(),
        sortType: Joi.string().optional(),
    }).validate(req.query);

    if (error) {
        // console.log(error);
        return res.status(400).json({ error });
    }
    next();
};

module.exports = {
    Create,
    Update,
    Image,
    Delete,
    getBtId,
    All,
};
