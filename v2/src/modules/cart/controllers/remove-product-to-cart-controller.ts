import { NextFunction, Response } from "express";
import { makeRemoveProductToCart } from "../index.js";
import { Request } from "express-jwt";

export async function removeProductToCartController(req: Request, res: Response, next: NextFunction) {
    const userId = req.auth?._id;
    const item: string = req.params?.itemId || "";
    try {
        const cart = await makeRemoveProductToCart().execute({ userId, item });

        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
}
