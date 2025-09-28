import { NextFunction, Response } from "express";
import { makeUpdateProductQuantity } from "../index.js";
import { Request } from "express-jwt";

export async function updateProductQuantityController(req: Request, res: Response, next: NextFunction) {
    const userId = req.auth?._id;
    const itemId: string = req.params.itemId;
    const quantity: number = Number(req.params.quantity);

    try {
        const cart = await makeUpdateProductQuantity().execute({ userId, itemId, quantity });

        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
}
