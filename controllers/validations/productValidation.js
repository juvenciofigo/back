const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const Create = (req, res, next) => {
    const { error } = Joi.object({
        productName: Joi.string().required(),
        productDescription: Joi.string().required(),
        productAvailability: Joi.boolean().required(),
        productPrice: Joi.number().required(),
        productStock: Joi.boolean().required(),
        productCategory: Joi.array().items(Joi.string().length(24).alphanum().required()).required(),
        productSubcategory: Joi.string().length(24).alphanum().optional(),
        productSub_category: Joi.string().length(24).alphanum().optional(),
        productPromotion: Joi.number().optional(),
        productImage: Joi.array().optional(),
        sku: Joi.string().required(),
        productVendor: Joi.string().required(),
        productModel: Joi.string().optional(),
        productSize: Joi.string().optional(),
        productBrand: Joi.string().optional(),
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
        productAvailability: Joi.boolean().optional(),
        productPrice: Joi.number().optional(),
        productStock: Joi.boolean().optional(),
        productCategory: Joi.array().items(Joi.string().length(24).alphanum().required()).optional(),
        productSubcategory: Joi.string().length(24).alphanum().optional(),
        productSub_category: Joi.string().length(24).alphanum().optional(),
        productPromotion: Joi.number().optional(),
        productImage: Joi.array().optional(),
        sku: Joi.string().optional(),
        productVendor: Joi.string().optional(),
        productModel: Joi.string().optional(),
        productSize: Joi.string().optional(),
        productBrand: Joi.string().optional(),
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
        category: Joi.string().alphanum().length(24).optional(),
        subcategory: Joi.string().alphanum().length(24).optional(),
        sub_category: Joi.string().alphanum().length(24).optional(),
        sortType: Joi.string().optional(),
    }).validate(req.query);

    if (error) {
        console.log(error);
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
