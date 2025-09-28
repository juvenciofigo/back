import { NextFunction, Request, Response } from "express";
import { makeGetAllUser } from "../index.js";

export async function getUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await makeGetAllUser().execute();

        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}
