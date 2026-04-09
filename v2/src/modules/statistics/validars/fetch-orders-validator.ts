import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function fetchOrdersValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        status: Joi.string().optional(),
        userId: Joi.string().hex().length(24).optional(),
        startDate: Joi.date().format("YYYY-MM-DD").iso().optional(),
        endDate: Joi.date().format("YYYY-MM-DD").iso().optional(),
        sort: Joi.string().valid("newest", "oldest").optional(),
    });

    const { error } = schema.validate(req.query, { abortEarly: false, allowUnknown: true });

    if (error) {
        return res.status(400).json({ 
            message: "Erro na validação dos parâmetros de pedidos",
            details: error.details.map((d: any) => d.message) 
        });
    }

    next();
}
