import { log } from "console";
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const singleItemSchema = Joi.object({
    productId: Joi.string().required().messages({
        "string.empty": "O ID do produto não pode vazio",
        "any.required": "O ID do produto é obrigatório",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "A quantidade deve ser um número",
        "number.min": "A quantidade deve ser pelo menos 1",
        "any.required": "A quantidade é obrigatória",
    }),
    variation: Joi.object({
        color: Joi.string().optional(),
        model: Joi.string().optional(),
        size: Joi.string().optional(),
        material: Joi.string().optional(),
    }).optional(),
    deliveryEstimate: Joi.string().optional()
});

const schema = Joi.alternatives().try(
    Joi.array().items(singleItemSchema).min(1).messages({
        "array.min": "Se enviar uma lista, deve conter pelo menos 1 produto",
    }),
    singleItemSchema
);

export const addProductToCartValidator = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Erro de validação dos dados do produto",
            details: error.details.map((detail) => detail.message),
        });
    }

    next();
};
