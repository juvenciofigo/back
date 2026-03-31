import { NextFunction, Request, Response } from "express";
import { makeGetRecentOrders } from "../index.js";

export async function getRecentOrdersController(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await makeGetRecentOrders().execute();
        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
}
