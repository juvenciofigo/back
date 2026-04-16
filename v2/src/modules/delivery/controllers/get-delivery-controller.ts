import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeGetDelivery } from "../factories/make-get-delivery.js";

export async function getDeliveryController(req: Request, res: Response, next: NextFunction) {
    const { deliveryId } = req.params;

    try {
        const delivery = await makeGetDelivery().execute(deliveryId!);
        return res.status(200).json(delivery);
    } catch (error) {
        next(error);
    }
}
