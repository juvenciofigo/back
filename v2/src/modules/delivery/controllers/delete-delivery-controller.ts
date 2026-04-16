import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeDeleteDelivery } from "../factories/make-delete-delivery.js";

export async function deleteDeliveryController(req: Request, res: Response, next: NextFunction) {
    const { deliveryId } = req.params;

    try {
        await makeDeleteDelivery().execute(deliveryId!);
        return res.status(200).json({ message: "Entrega eliminada com sucesso" });
    } catch (error) {
        next(error);
    }
}
