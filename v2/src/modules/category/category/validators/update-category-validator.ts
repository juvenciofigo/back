import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function updateCategoryValidator(req: Request, res: Response, next: NextFunction) {
    const data = { ...req.body, ...req.params };

    const schema = Joi.object({
        categoryId: Joi.string().alphanum().length(24).required(),
        categoryName: Joi.string().trim().optional(),
        code: Joi.string().trim().optional(),
        availability: Joi.boolean().optional(),
        products: Joi.array().items(Joi.string().alphanum().length(24).required()).optional(),
    });

    const { error } = schema.validate(data);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
