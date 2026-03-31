import { NextFunction, Request, Response } from "express";
import { makeGetTopSellingProducts } from "../index.js";

export async function getTopSellingProductsController(req: Request, res: Response, next: NextFunction) {
    // Limit optional querystring param
    const limitParam = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const limit = isNaN(limitParam) ? 5 : limitParam;

    try {
        const stats = await makeGetTopSellingProducts().execute(limit);
        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
}
