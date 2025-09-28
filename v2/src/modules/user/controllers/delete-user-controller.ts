import { NextFunction, Response } from "express";
import { makeDeleteUser } from "../index.js";
import { Request } from "express-jwt";

export async function deleteUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req?.auth?._id;

        const deleteUserService = await makeDeleteUser().execute({ userId: id });

        return res.status(200).send(deleteUserService);
    } catch (error: unknown) {
        next(error);
    }
}
