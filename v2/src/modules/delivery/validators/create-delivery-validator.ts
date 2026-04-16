import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function createDeliveryValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        orderId: Joi.string().hex().length(24).required(),
        addressId: Joi.string().hex().length(24).required(),
        vehicleClass: Joi.string().valid("motorcycle", "lightVehicle", "heavyVehicle").optional(),
        deliveryType: Joi.string().valid("STANDARD", "EXPRESS", "PICKUP_POINT").required(),
        trackingCode: Joi.string().allow("").optional(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Erro de validação na criação da entrega",
            details: error.details.map((d) => d.message),
        });
    }

    next();
}
