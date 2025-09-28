import { NextFunction, Response } from "express";
import { makeGetUser, UnauthorizedError } from "../index.js";
import { Request } from "express-jwt";

export async function getUserProfileController(req: Request, res: Response, next: NextFunction) {
    const authId = req?.auth?._id;
    const userId: string = req.params.id || "";

    try {
        if (authId !== userId) {
            throw new UnauthorizedError();
        }

        const getUserProfileService = await makeGetUser().execute({ userId });

        return res.status(200).send(getUserProfileService);
    } catch (error: unknown) {
        next(error);
    }
}
