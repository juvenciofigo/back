import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function fetchSubCategoriesValidator(req: Request, res: Response, next: NextFunction) {
    const { error } = Joi.object({
        categoryId: Joi.string().alphanum().length(24).optional(),
        subCategoryName: Joi.string().trim().optional(),
        availability: Joi.boolean().optional(),
    }).validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
