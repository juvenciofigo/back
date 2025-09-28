import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);

import { NextFunction, Request, Response } from "express";

export async function registerUserValitaror(req: Request, res: Response, next: NextFunction) {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
