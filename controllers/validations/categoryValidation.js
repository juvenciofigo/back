const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const createCategory = (req, res, next) => {
    const { error } = Joi.object({
        categoryName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        next(error);
    }
    next();
};

const createSubCategories = (req, res, next) => {
    const { error } = Joi.object({
        categoryID: Joi.string().alphanum().length(24).required(),
        subCategoryName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        next(error);
    }
    next();
};

const createSub_categories = (req, res, next) => {
    const { error } = Joi.object({
        subCategoryID: Joi.string().alphanum().length(24).required(),
        sub_categoryName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        next(error);
    }
    next();
};

const categoryDetails = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

const updateCategory = (req, res, next) => {
    const paramsSchema = Joi.object({
        id: Joi.string().alphanum().length(2).required(),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
        next(error);
    }
    const bodySchema = Joi.object({
        categoryName: Joi.string().optional(),
        code: Joi.string(),
        availability: Joi.boolean().optional(),
        products: Joi.array().items(Joi.string().alphanum().length(24).required()).optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);

    if (bodyError) {
        next(error);
    }
    next();
};

const removeCategory = (req, res, next) => {
    const { error } = Joi.object({
        id: Joi.string().alphanum().length(24).required(),
    }).validate(req.params);

    if (error) {
        next(error);
    }
    next();
};

module.exports = { createCategory, createSubCategories, createSub_categories, categoryDetails, updateCategory, removeCategory };
