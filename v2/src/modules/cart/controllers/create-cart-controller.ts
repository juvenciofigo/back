import { NextFunction, Response } from "express";
import { makeCreateCart } from "../index.js";
import { Request } from "express-jwt";

export async function createCartController(req: Request, res: Response, next: NextFunction) {
    const userId = req?.auth?._id;

    try {
        const cart = await makeCreateCart().execute({ userId });

        return res.status(200).json({ cart, success: true });
    } catch (error) {
        next(error);
    }
}
