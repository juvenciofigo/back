import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function fetchRegionalValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        regionId: Joi.string().hex().length(24).optional(),
        provinceId: Joi.string().hex().length(24).optional(),
        cityId: Joi.string().hex().length(24).optional(),
        zoneId: Joi.string().hex().length(24).optional(),
        search: Joi.string().allow("").optional(),
        sort: Joi.string().optional(),
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        all: Joi.boolean().optional(),
        availability: Joi.boolean().optional(),
    });

    const { error } = schema.validate(req.query, { abortEarly: false, allowUnknown: true });

    if (error) {
        return res.status(400).json({ 
            message: "Erro na validação dos parâmetros de listagem regional",
            details: error.details.map((d: any) => d.message) 
        });
    }

    next();
}
