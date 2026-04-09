import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function getAddressValidator(req: Request, res: Response, next: NextFunction) {
    const { error } = Joi.object({
        addressId: Joi.string().required(),
    }).validate(req.params);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
