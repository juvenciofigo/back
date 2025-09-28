import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { makeUpdateUser, UnauthorizedError } from "../index.js";

export async function updateUserController(req: Request, res: Response, next: NextFunction) {
    const authId = req?.auth?._id;
    const userId = req.params.id || "";
    const { firstName, lastName, email, password } = req.body;

    try {
        if (authId !== userId) {
            throw new UnauthorizedError();
        }

        const updateUserService = await makeUpdateUser().execute({ userId, firstName, lastName, email, password });

        return res.status(200).send(updateUserService);
    } catch (error: unknown) {
        next(error);
    }
}
