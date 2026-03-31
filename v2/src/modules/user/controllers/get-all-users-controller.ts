import { NextFunction, Request, Response } from "express";
import { makeGetAllUser } from "../index.js";

export async function getUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await makeGetAllUser().execute(Number(req.query.page), Number(req.query.limit));

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
