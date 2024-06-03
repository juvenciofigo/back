const Joi = require("joi");

const getAllVariations = (req, res, next) => {
    const { error } = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    }).validate(req.query);

    if (error) {
        next(error);
    }
    next();
};

const getVariatiosProduct = (req, res, next) => {
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

const createVariation = (req, res, next) => {
    const querySchema = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        next(error);
    }

    const bodySchema = Joi.object({
        variationCode: Joi.string().required(),
        variationName: Joi.string().required(),
        variationPrice: Joi.number().required(),
        variationPromotion: Joi.number().optional(),
        variationStock: Joi.boolean().optional(),
        delivery: Joi.object({
            dimensions: Joi.object({
                heightCm: Joi.number().required(),
                widthCm: Joi.number().required(),
                depthCm: Joi.number().required(),
            }).required(),
            weight: Joi.number().required(),
            shippingFree: Joi.boolean().optional(),
        }).required(),
        variationQuantity: Joi.number().optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        next(error);
    }

    next();
};

const updateVariation = (req, res, next) => {
    const bodySchema = Joi.object({
        variationCode: Joi.string().optional(),
        variationName: Joi.string().optional(),
        variationPrice: Joi.number().optional(),
        variationPromotion: Joi.number().optional(),
        variationStock: Joi.boolean().optional(),
        delivery: Joi.object({
            dimensions: Joi.object({
                heightCm: Joi.number().optional(),
                widthCm: Joi.number().optional(),
                depthCm: Joi.number().optional(),
            }).optional(),
            weight: Joi.number().optional(),
            shippingFree: Joi.boolean().optional(),
        }).optional(),
        variationQuantity: Joi.number().optional(),
        variationAvailable: Joi.boolean().optional(),
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

    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    next();
};

const imageVariation = (req, res, next) => {
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

const deleteVariation = (req, res, next) => {
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

module.exports = {
    getAllVariations,
    getVariatiosProduct,
    createVariation,
    imageVariation,
    updateVariation,
    deleteVariation,
};
