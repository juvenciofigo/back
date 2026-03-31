import { NextFunction, Request, Response } from "express";
import { makeGetRevenueByMonth } from "../index.js";

export async function getRevenueByMonthController(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await makeGetRevenueByMonth().execute();
        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
}
