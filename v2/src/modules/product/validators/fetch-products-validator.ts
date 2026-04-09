import BaseJoi from "joi";
const Joi = BaseJoi;
import { Request, Response, NextFunction } from "express";

export async function fetchProductsValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        search: Joi.string().allow("").optional(),
        sort: Joi.string().valid("newest", "oldest").optional(),
        category: Joi.string().hex().length(24).optional(),
        subcategory: Joi.string().hex().length(24).optional(),
        sub_category: Joi.string().hex().length(24).optional(),
        brand: Joi.string().hex().length(24).optional(),
    });

    const { error } = schema.validate(req.query, { abortEarly: false, allowUnknown: true });

    if (error) {
        return res.status(400).json({ 
            message: "Erro na validação dos parâmetros de busca",
            details: error.details.map((d: any) => d.message) 
        });
    }

    next();
}
