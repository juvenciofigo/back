import { NextFunction, Response } from "express";
import { makeAddProductToCart, UnauthorizedError } from "../index.js";
import { Request } from "express-jwt";

export async function addProductToCartController(req: Request, res: Response, next: NextFunction) {
    const userId = req.auth?._id;
    const tempCart = req.body;

    const { productId, quantity, variation, deliveryEstimate } = req.body;

    try {
        if (!userId) {
            throw new UnauthorizedError();
        }
        const carts = await makeAddProductToCart().execute({ userId, tempCart, singleItem: { productId, quantity, variation, deliveryEstimate } });

        return res.status(200).json(carts);
    } catch (error) {
        next(error);
    }
}
