import { NextFunction, Request, Response } from "express";
import { makeGetCarts } from "../index.js";

export async function getCartsController(req: Request, res: Response, next: NextFunction) {
    try {
        const carts = await makeGetCarts().execute();

        return res.status(200).json(carts);
    } catch (error) {
        next(error);
    }
}
