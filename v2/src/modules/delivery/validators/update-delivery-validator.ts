import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function updateDeliveryValidator(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object({
        deliveryId: Joi.string().hex().length(24).required(),
    });

    const bodySchema = Joi.object({
        status: Joi.string().optional(),
        orderPrice: Joi.number().optional(),
        deliveredAt: Joi.date().optional(),
        deliveryDeadline: Joi.date().optional(),
        trackingCode: Joi.string().allow("").optional(),
        deliveryType: Joi.string().valid("STANDARD", "EXPRESS", "PICKUP_POINT").optional(),
        logistics: Joi.object({
            baseFee: Joi.number().optional(),
            tollFee: Joi.number().optional(),
            weightFee: Joi.number().optional(),
            totalShipping: Joi.number().optional(),
        }).optional(),
    }).min(1); // Pelo menos um campo deve ser enviado para atualização

    const paramsError = paramsSchema.validate(req.params).error;
    const bodyError = bodySchema.validate(req.body, { abortEarly: false }).error;

    if (paramsError || bodyError) {
        return res.status(400).json({
            message: "Erro de validação na atualização da entrega",
            details: [
                ...(paramsError ? [paramsError.message] : []),
                ...(bodyError ? bodyError.details.map((d) => d.message) : []),
            ],
        });
    }

    next();
}
