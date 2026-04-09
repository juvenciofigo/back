import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeFetchCarts } from "../index.js";

export async function getCartsController(req: Request, res: Response, next: NextFunction) {
    try {
        const carts = await makeFetchCarts().execute(req);

        return res.status(200).json(carts);
    } catch (error) {
        next(error);
    }
}
