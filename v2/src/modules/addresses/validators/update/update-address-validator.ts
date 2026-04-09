import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function updateAddressValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        complete: Joi.string().optional(),
        city: Joi.string().hex().length(24).optional(),
        province: Joi.string().hex().length(24).optional(),
        neighborhood: Joi.string().hex().length(24).optional(),
        reference: Joi.string().allow("").optional(),
        note: Joi.string().allow("").optional(),
        cellNumber: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Erro de validação",
            details: error.details.map(d => d.message),
        });
    }
    next();
}
