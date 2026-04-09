import { NextFunction, Response } from "express";
import { makeGetCartTotal } from "../index.js";
import { Request } from "express-jwt";

export async function getCartTotalController(req: Request, res: Response, next: NextFunction) {
    const userId = req.auth?._id || null;
    const body = req.body;

    try {
        const cartTotal = await makeGetCartTotal().execute({ userId, body });

        return res.status(200).json(cartTotal);
    } catch (error) {
        next(error);
    }
}
