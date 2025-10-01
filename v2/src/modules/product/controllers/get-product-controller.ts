import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeGetProduct } from "../index.js";

export async function getProductController(req: Request, res: Response, next: NextFunction) {
    const productId = req.params.productId || "";
    try {
        const products = await makeGetProduct().execute(productId);

        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}
