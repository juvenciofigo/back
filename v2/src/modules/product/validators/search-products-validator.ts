import BaseJoi from "joi";
import Extension from "@hapi/joi-date";
const Joi = BaseJoi.extend(Extension);
import { Request, Response, NextFunction } from "express";

export async function searchProductsValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        search: Joi.string().min(1).max(100).required().messages({
            "any.required": "O parâmetro 'search' é obrigatório.",
            "string.min": "O termo de busca deve ter pelo menos 1 caractere.",
            "string.max": "O termo de busca não pode exceder 100 caracteres.",
        }),
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
    });

    const { error } = schema.validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}
