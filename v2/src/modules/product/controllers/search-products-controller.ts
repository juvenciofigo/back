import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeSearchProducts } from "../index.js";

export async function searchProductsController(req: Request, res: Response, next: NextFunction) {
    const search = String(req.query?.search || "");
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 30;

    try {
        const results = await makeSearchProducts().execute({ search, page, limit });

        return res.status(200).json(results);
    } catch (error) {
        next(error);
    }
}
