import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function createCategoryValidator(req: Request, res: Response, next: NextFunction) {
    const { error } = Joi.object({
        categoryName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
