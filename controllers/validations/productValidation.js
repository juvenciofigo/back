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
        productImage: Joi.array().optional(),
        productCategory: Joi.array().items(Joi.string().length(24).alphanum().required()).required(),
        productSubcategory: Joi.array().items(Joi.string().length(24).alphanum().optional()).optional(),
        productSub_category: Joi.array().items(Joi.string().length(24).alphanum().optional()).optional(),
        productPromotion: Joi.number().optional(),
        productVendor: Joi.string().required(),
        productModel: Joi.string().optional(),
        productBrand: Joi.string().optional(),
        productWeight: Joi.number().required(),
        productLength: Joi.number().optional(),
        productWidth: Joi.number().optional(),
        productHeight: Joi.number().optional(),
        sku: Joi.string().required(),
        deliveryEstimate: Joi.array()
            .items(
                Joi.object({
                    additionalCost: Joi.number().optional(),
                    estimatedTime: Joi.string().valid("Imediata", "7 dias", "30 dias").optional(),
                })
            )
            .optional(),
        // acquisitionCost: Joi.number.required(),
        // additionalCosts: Joi.number.required(),
    }).validate(req.body, { abortEarly: false });

    if (error) {
        console.log(error);

        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const Update = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }
    const bodySchema = Joi.object({
        productName: Joi.string().optional(),
        productDescription: Joi.string().optional(),
        productAvailability: Joi.boolean().optional(),
        productPrice: Joi.number().optional(),
        productStock: Joi.boolean().optional(),
        productImage: Joi.array().optional(),
        productCategory: Joi.array().items(Joi.string().length(24).alphanum().required()).optional(),
        productSubcategory: Joi.array().items(Joi.string().length(24).alphanum().required()).optional(),
        productSub_category: Joi.array().items(Joi.string().length(24).alphanum().required()).optional(),
        productPromotion: Joi.number().optional(),
        productVendor: Joi.string().optional(),
        productModel: Joi.string().optional(),
        productBrand: Joi.string().optional(),
        productWeight: Joi.number().optional(),
        productLength: Joi.number().optional(),
        productWidth: Joi.number().optional(),
        productHeight: Joi.number().optional(),
        deliveryEstimate: Joi.array()
            .items(
                Joi.object({
                    additionalCost: Joi.number().optional(),
                    estimatedTime: Joi.string().valid("Imediata", "7 dias", "30 dias").optional(),
                })
            )
            .optional(),
        sku: Joi.string().optional(),
        // acquisitionCost: Joi.number.required(),
        // additionalCosts: Joi.number.required(),
    });

    const { error } = bodySchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const Image = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const Delete = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const getBtId = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
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
        return res.status(400).json({ message: error.details[0].message });
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
