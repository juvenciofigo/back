import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function fetchProductsValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        category: Joi.string().alphanum().length(24).optional(),
        subcategory: Joi.string().alphanum().length(24).optional(),
        sub_category: Joi.string().alphanum().length(24).optional(),
    });

    const { error } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}
