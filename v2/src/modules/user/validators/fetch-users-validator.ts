import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function fetchUsersValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        search: Joi.string().allow("").optional(),
        role: Joi.string().optional(), // Pode validar por enum no futuro ex: .valid("admin", "client")
        status: Joi.string().optional(),
        sort: Joi.string().valid("newest", "oldest").optional(),
    });

    const { error } = schema.validate(req.query, { abortEarly: false, allowUnknown: true });

    if (error) {
        return res.status(400).json({ 
            message: "Erro na validação dos parâmetros de usuários",
            details: error.details.map((d: any) => d.message) 
        });
    }

    next();
}
