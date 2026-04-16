import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function deleteDeliveryValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        deliveryId: Joi.string().hex().length(24).required(),
    });

    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Erro de validação: ID da entrega para eliminação inválido",
            details: error.details.map((d) => d.message),
        });
    }

    next();
}
