import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function fetchSub_categoriesValidator(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object({
        subCategoryId: Joi.string().hex().length(24).required(),
    });

    const querySchema = Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        search: Joi.string().allow("").optional(),
        availability: Joi.boolean().optional(),
        sort: Joi.string().valid("newest", "oldest").optional(),
        all: Joi.boolean().optional(),
    });

    const paramsValidation = paramsSchema.validate(req.params);
    const queryValidation = querySchema.validate(req.query, { abortEarly: false, allowUnknown: true });

    if (paramsValidation.error) {
        return res.status(400).json({ message: paramsValidation.error.details[0]?.message });
    }

    if (queryValidation.error) {
        return res.status(400).json({ 
            message: "Erro na validação dos parâmetros de subcategorias L3",
            details: queryValidation.error.details.map((d: any) => d.message) 
        });
    }

    next();
}
