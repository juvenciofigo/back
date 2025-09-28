import { NextFunction, Response } from "express";
import { makeGetCartDetails } from "../index.js";
import { Request } from "express-jwt";
export async function getCartDetailsController(req: Request, res: Response, next: NextFunction) {
    const userId = req.auth?._id;
    
    const body = req.body;
    try {
        const cart = await makeGetCartDetails().execute({ userId, body });

        return res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
}
