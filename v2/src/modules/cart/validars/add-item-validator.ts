import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);

import { Request, Response, NextFunction } from "express";

export async function addItemValidator(req: Request, res: Response, next: NextFunction) {
    const data = { ...req.params, ...req.body };

    const schema = Joi.object({
        productId: Joi.string().alphanum().length(24).required(),
        deliveryEstimate: Joi.string().alphanum().length(24).optional(),
        quantity: Joi.number().integer().min(1).optional(),
        variation: Joi.object({
            color: Joi.string().optional(),
            model: Joi.string().optional(),
            size: Joi.string().optional(),
            material: Joi.string().optional(),
        }).optional(),
    });

    const { error } = schema.validate(data);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}
