import { NextFunction, Request, Response } from "express";
import { makeGetSuperficialStats } from "../index.js";

export async function getSuperficialStatsController(req: Request, res: Response, next: NextFunction) {
    try {
        const stats = await makeGetSuperficialStats().execute();
        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
}
