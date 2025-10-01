import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeFetchProducts } from "../index.js";

export async function fetchProductsController(req: Request, res: Response, next: NextFunction) {
    try {
        const products = await makeFetchProducts().execute();

        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}
