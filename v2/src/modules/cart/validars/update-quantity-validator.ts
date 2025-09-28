import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);

import { Request, Response, NextFunction } from "express";

export async function updateQuantityValidator(req: Request, res: Response, next: NextFunction) {
    const { error } = Joi.object({
        itemId: Joi.string().alphanum().length(24).required(),
        quantity: Joi.number().required(),
    }).validate(req.params);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
