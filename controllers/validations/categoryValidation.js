const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const createCategory = (req, res, next) => {
    const { error } = Joi.object({
        categoryName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const createSubCategories = (req, res, next) => {
    const { error } = Joi.object({
        categoryID: Joi.string().alphanum().length(24).required(),
        subCategoryName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const createSub_categories = (req, res, next) => {
    const { error } = Joi.object({
        subCategoryID: Joi.string().alphanum().length(24).required(),
        sub_categoryName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const categoryDetails = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const updateCategory = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(2).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message });
    }
    const bodySchema = Joi.object({
        categoryName: Joi.string().optional(),
        code: Joi.string(),
        availability: Joi.boolean().optional(),
        products: Joi.array().items(Joi.string().alphanum().length(24).required()).optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        console.log(bodyError);
        return res.status(400).json({ error: bodyError.details[0].message });
    }
    next();
};

const removeCategory = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        console.log(error);
        return res.status(400).json({ error });
    }
    next();
};

module.exports = { createCategory, createSubCategories, createSub_categories, categoryDetails, updateCategory, removeCategory };
