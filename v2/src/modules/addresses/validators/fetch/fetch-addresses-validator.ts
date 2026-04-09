import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function fetchAddressesValidator(req: Request, res: Response, next: NextFunction) {
    const { error } = Joi.object({
        search: Joi.string().optional(),
        sort: Joi.string().optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
        all: Joi.string().optional(),
        userId: Joi.string().optional(),
        customerId: Joi.string().optional(),
        deleted: Joi.string().valid("true", "false").optional(),
    }).validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
