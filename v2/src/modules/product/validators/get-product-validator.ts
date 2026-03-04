import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function getProductValidator(req: Request, res: Response, next: NextFunction) {
    const data = { ...req.params };

    const schema = Joi.object({
        productId: Joi.string().length(24).alphanum().required(),
    });

    const { error } = schema.validate(data);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
