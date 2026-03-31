import { NextFunction, Request, Response } from "express";
import { makeGetDataByMonth } from "../index.js";

export async function getDataByMonthController(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await makeGetDataByMonth().execute();
        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
}
