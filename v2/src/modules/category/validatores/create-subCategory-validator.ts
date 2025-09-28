import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function createSubCategoryValidator(req: Request, res: Response, next: NextFunction) {
    const { error } = Joi.object({
        subCategoryName: Joi.string().required(),
        categoryId: Joi.string().alphanum().length(24).required(),
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
