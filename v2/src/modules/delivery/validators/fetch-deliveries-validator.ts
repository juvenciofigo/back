import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function fetchDeliveriesValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).optional(),
        search: Joi.string().allow("").optional(),
        sort: Joi.string().valid("newest", "oldest").optional(),
        status: Joi.string().optional(),
        deliveryType: Joi.string().optional(),
        trackingCode: Joi.string().allow("").optional(),
        deliveryDeadline: Joi.date().optional(),
    });

    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Erro de validação na listagem de entregas",
            details: error.details.map((d) => d.message),
        });
    }

    next();
}
