import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeCreateDelivery } from "../factories/make-create-delivery.js";

export async function createDeliveryController(req: Request, res: Response, next: NextFunction) {
    const { orderId, addressId, vehicleClass, deliveryType, trackingCode } = req.body;

    try {
        const delivery = await makeCreateDelivery().execute({
            orderId,
            addressId,
            vehicleClass,
            deliveryType,
            trackingCode
        });

        return res.status(201).json(delivery);
    } catch (error) {
        next(error);
    }
}
