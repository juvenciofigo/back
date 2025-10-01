import { NextFunction, Response } from "express";
import { makeCreateBrand } from "../index.js";
import { Request } from "express-jwt";

export async function createbrandController(req: Request, res: Response, next: NextFunction) {
    const data = req.body;

    try {
        const product = await makeCreateBrand().execute(data);

        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}
