import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);

import { Request, Response, NextFunction } from "express";
export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
