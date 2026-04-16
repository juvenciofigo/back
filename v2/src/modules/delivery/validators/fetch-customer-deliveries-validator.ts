import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function fetchCustomerDeliveriesValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).optional(),
        status: Joi.string().optional(),
    });

    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Erro de validação na listagem de minhas entregas",
            details: error.details.map((d) => d.message),
        });
    }

    next();
}
