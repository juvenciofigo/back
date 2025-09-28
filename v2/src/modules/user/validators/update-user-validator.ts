import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);

import { NextFunction, Request, Response } from "express";

export async function updateUserValidator(req: Request, res: Response, next: NextFunction) {
    const data = { ...req.body, id: req.params.id };

    const schema = Joi.object({
        email: Joi.string().email().optional(),
        password: Joi.string().min(6).optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        id: Joi.string().alphanum().length(24).required(),
    });

    const { error } = schema.validate(data);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}
