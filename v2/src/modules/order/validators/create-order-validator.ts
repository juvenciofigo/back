import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createOrderValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        cart: Joi.string().required().messages({
            "string.empty": "O ID do carrinho é obrigatório",
            "any.required": "O ID do carrinho é obrigatório"
        }),
        address: Joi.string().required().messages({
            "string.empty": "O ID do endereço é obrigatório",
            "any.required": "O ID do endereço é obrigatório"
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Erro de validação",
            errors: error.details.map(err => err.message)
        });
    }

    next();
};
