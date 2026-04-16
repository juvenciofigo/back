import { NextFunction, Request, Response } from "express";
import { makeFetchUsers } from "../index.js";

export async function fetchUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await makeFetchUsers().execute(req);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
