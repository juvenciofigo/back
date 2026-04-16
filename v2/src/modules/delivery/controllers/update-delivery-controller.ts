import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeUpdateDelivery } from "../factories/make-update-delivery.js";

export async function updateDeliveryController(req: Request, res: Response, next: NextFunction) {
    const { deliveryId } = req.params;
    const updateData = req.body;

    try {
        const updatedDelivery = await makeUpdateDelivery().execute(deliveryId!, updateData);
        return res.status(200).json(updatedDelivery);
    } catch (error) {
        next(error);
    }
}
