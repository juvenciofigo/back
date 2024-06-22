const Joi = require("joi");

const getAllVariations = (req, res, next) => {
    const { error } = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    }).validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const getVariatiosProduct = (req, res, next) => {
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

const createVariation = (req, res, next) => {
    const paramsSchema = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }

    const bodySchema = Joi.object({
        sku: Joi.string().required(),
        variationProduct: Joi.string().alphanum().length(24).required(),
        variationType: Joi.string().required(),
        variationValue: Joi.string().required(),
        variationPrice: Joi.number().optional().allow(null),
        variationImage: Joi.array().optional(),
        variationPromotion: Joi.number().optional().allow(null),
        variationStock: Joi.boolean().optional().allow(null),
        delivery: Joi.object({
            dimensions: Joi.object({
                heightCm: Joi.number().optional().allow(null),
                widthCm: Joi.number().optional().allow(null),
                depthCm: Joi.number().optional().allow(null),
            })
                .optional()
                .allow(null),
            weight: Joi.number().optional().allow(null),
            shippingFree: Joi.boolean().optional().allow(null),
        })
            .optional()
            .allow(null),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        console.log(bodyError);
        return res.status(400).json({ message: bodyError.details[0].message });
    }

    next();
};

const updateVariation = (req, res, next) => {
    const bodySchema = Joi.object({
        sku: Joi.string().required(),
        variationType: Joi.string().required(),
        variationValue: Joi.string().required(),
        variationPrice: Joi.number().optional(),
        variationPromotion: Joi.number().optional(),
        variationStock: Joi.boolean().optional(),
        delivery: Joi.object({
            dimensions: Joi.object({
                heightCm: Joi.number().optional(),
                widthCm: Joi.number().optional(),
                depthCm: Joi.number().optional(),
            }),
            weight: Joi.number().optional(),
            shippingFree: Joi.boolean().optional(),
        }).required(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        return res.status(400).json({ message: bodyError.details[0].message });
    }

    const querySchema = Joi.object({
        product: Joi.string().alphanum().length(24).required(),
    });

    const { error: queryError } = querySchema.validate(req.query);

    if (queryError) {
        return res.status(400).json({ message: queryError.details[0].message });
    }

    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    });  

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }
    next();
};

const imageVariation = (req, res, next) => {
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

const deleteVariation = (req, res, next) => {
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

module.exports = {
    getAllVariations,
    getVariatiosProduct,
    createVariation,
    imageVariation,
    updateVariation,
    deleteVariation,
};
