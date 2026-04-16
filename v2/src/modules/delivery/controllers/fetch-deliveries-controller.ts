import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeFetchDeliveries } from "../factories/make-fetch-deliveries.js";

export async function fetchDeliveriesController(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await makeFetchDeliveries().execute(req.query);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
